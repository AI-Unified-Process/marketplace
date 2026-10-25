/*
 * Copyright 2000-2026 Vaadin Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */
import { getScheduler } from '../TrackingScheduler';
import { getRelativeTimeMillis, getRelativeTimeString, isEnabled, logBootstrapTimings, logTimings, reset as resetProfiler } from '../Profiler';
import { redirect } from '../WidgetUtil';
import { getServerId, isResynchronize, PendingMessageQueue, UNDEFINED_SYNC_ID } from './MessageOrdering';
import { ResynchronizationState } from './MessageSender';
import { runWhenEagerDependenciesLoaded } from '../EagerDependencyTracker';
import { Reactive } from '../flow/reactive/Reactive';
import { processChanges as applyTreeChanges } from '../flow/TreeChangeProcessor';
import { UIState } from '../UILifecycle';
import { Console } from '../Console';
/** Removes the link and style elements with the given dependency id. */
function removeStylesheetByIdFromDom(dependencyId) {
    const elements = document.querySelectorAll(`link[data-id="${dependencyId}"], style[data-id="${dependencyId}"]`);
    for (const element of Array.from(elements)) {
        element.remove();
    }
}
/** Invokes the element's afterServerUpdate callback if it defines one. */
function callAfterServerUpdates(node) {
    const target = node;
    if (node && target.afterServerUpdate) {
        target.afterServerUpdate();
    }
}
/** Milliseconds from the navigation response start to now, or -1 if unknown. */
function calculateBootstrapTime() {
    const perf = window.performance;
    if (perf && perf.timing) {
        return Date.now() - perf.timing.responseStart;
    }
    return -1;
}
function parseJSONResponse(jsonText) {
    return JSON.parse(jsonText);
}
/** The navigation fetchStart timestamp, or 0 if unknown. */
function getFetchStartTime() {
    const perf = window.performance;
    if (perf && perf.timing && perf.timing.fetchStart) {
        return perf.timing.fetchStart;
    }
    return 0;
}
// com.vaadin.flow.shared.ApplicationConstants / JsonConstants
const CSRF_TOKEN_DEFAULT_VALUE = 'init';
const CLIENT_TO_SERVER_ID = 'clientId';
const UIDL_SECURITY_TOKEN_ID = 'Vaadin-Security-Key';
const UIDL_PUSH_ID = 'Vaadin-Push-ID';
const UIDL_KEY_EXECUTE = 'execute';
const META_SESSION_EXPIRED = 'sessionExpired';
const META_ASYNC = 'async';
const SESSION_EXPIRED_HANDLING_DELAY = 250;
/**
 * A MessageHandler is responsible for handling all incoming messages (JSON)
 * from the server (state changes, RPCs and other updates) and ensuring that the
 * connectors are updated accordingly.
 */
export class MessageHandler {
    #registry;
    // Locks; while non-empty, response handling is suspended.
    #responseHandlingLocks = new Set();
    // The server-sync-id ordering state + the queue of pending messages.
    #ordering = new PendingMessageQueue();
    #csrfToken = CSRF_TOKEN_DEFAULT_VALUE;
    #pushId = null;
    #bootstrapTime = 0;
    // Profiling timings (ms), exposed via getProfilingData / client.getProfilingData.
    lastProcessingTime = 0;
    totalProcessingTime = 0;
    #serverTimingInfo = null;
    #initialMessageHandled = false;
    #forceHandleMessage = null;
    #nextResponseSessionExpiredHandler = null;
    /**
     * Creates a new instance connected to the given registry.
     *
     * @param registry - the global registry
     */
    constructor(registry) {
        this.#registry = registry;
    }
    #resetForceHandleTimer() {
        if (this.#forceHandleMessage !== null) {
            clearTimeout(this.#forceHandleMessage);
            this.#forceHandleMessage = null;
        }
    }
    /**
     * Handles a received UIDL JSON text, parsing it, and passing it on to the
     * appropriate handlers, while logging timing information.
     *
     * @param json - The JSON to handle
     */
    handleMessage(json) {
        if (getServerId(json) === -1) {
            const meta = json.meta;
            // Log the error only if session didn't expire.
            if (!meta || !(META_SESSION_EXPIRED in meta)) {
                Console.error("Response didn't contain a server id. " +
                    'Please verify that the server is up-to-date and that the response data has not been modified in transmission.');
            }
        }
        let state = this.#registry.getUILifecycle().getState();
        if (state === UIState.INITIALIZING) {
            // Application is starting up for the first time
            state = UIState.RUNNING;
            this.#registry.getUILifecycle().setState(state);
        }
        if (state === UIState.RUNNING) {
            this.handleJSON(json);
        }
        else {
            Console.warn('Ignored received message because application has already been stopped');
        }
    }
    handleJSON(valueMap) {
        const serverId = getServerId(valueMap);
        const hasResynchronize = isResynchronize(valueMap);
        if (!hasResynchronize &&
            this.#registry.getMessageSender().getResynchronizationState() === ResynchronizationState.WAITING_FOR_RESPONSE) {
            if (UIDL_KEY_EXECUTE in valueMap) {
                const commands = valueMap[UIDL_KEY_EXECUTE];
                for (const command of commands) {
                    if (command.length > 0 && command[0] === 'window.location.reload();') {
                        Console.warn('Executing forced page reload while a resync request is ongoing.');
                        window.location.reload();
                        return;
                    }
                }
            }
            // A resync is in progress (WAITING_FOR_RESPONSE state). The incoming
            // message could have been generated by a background thread during the
            // server-side resync process and pushed to the client, so it's a
            // potentially valid message that should be processed after
            // resynchronization completes. We queue this message now and will handle it
            // later.
            // Note: If its id is older than the resync request, it will be discarded
            // during subsequent processing.
            Console.warn('Queueing message from the server as a resync request is ongoing.');
            this.#ordering.push(valueMap);
            return;
        }
        this.#registry.getMessageSender().clearResynchronizationState();
        if (hasResynchronize && !this.#ordering.isNextExpectedMessage(serverId)) {
            // Resynchronize request. We must remove any old pending messages and
            // ensure this is handled next. Otherwise we would keep waiting for an
            // older message forever (if this is triggered by forceMessageHandling).
            Console.debug(`Received resync message with id ${serverId} while waiting for ${this.#ordering.getExpectedServerId()}`);
            this.#ordering.setLastSeenServerSyncId(serverId - 1);
            this.#ordering.removeOld();
        }
        const locked = this.#responseHandlingLocks.size > 0;
        // Cannot or should not handle this message right now, either because of
        // locks or because it's an out-of-order message.
        if (locked || !this.#ordering.isNextExpectedMessage(serverId)) {
            if (locked) {
                // Some component is doing something that can't be interrupted (e.g. an
                // animation that should be smooth).
                Console.debug('Postponing UIDL handling due to lock...');
            }
            else {
                // Unexpected server id
                if (this.#ordering.isAlreadySeen(serverId)) {
                    // Why is the server re-sending an old package? Ignore it
                    Console.warn(`Received message with server id ${serverId} but have already seen a newer one. Ignoring it`);
                    this.#endRequestIfResponse(valueMap);
                    return;
                }
                // We are waiting for an earlier message...
                Console.debug(`Received message with server id ${serverId} but expected ${this.#ordering.getExpectedServerId()}. ` +
                    'Postponing handling until the missing message(s) have been received');
            }
            // Enqueue the UIDL message for later processing.
            this.#ordering.push(valueMap);
            if (this.#forceHandleMessage === null) {
                const timeout = this.#registry.getApplicationConfiguration().getMaxMessageSuspendTimeout();
                this.#forceHandleMessage = setTimeout(() => this.#forceMessageHandling(), timeout);
            }
            return;
        }
        if (hasResynchronize) {
            // Unregister all nodes and rebuild the state tree.
            this.#registry.getStateTree().prepareForResync();
        }
        const lock = {};
        this.suspendReponseHandling(lock);
        Console.debug('Handling message from server');
        this.#registry.getRequestResponseTracker().fireResponseHandlingStarted();
        // Client id must be updated before server id (a server-id update can trigger
        // a resync that must use the updated client id).
        if (CLIENT_TO_SERVER_ID in valueMap) {
            this.#registry
                .getMessageSender()
                .setClientToServerMessageId(valueMap[CLIENT_TO_SERVER_ID], hasResynchronize);
        }
        if (serverId !== -1) {
            this.#ordering.setLastSeenServerSyncId(serverId);
        }
        if ('redirect' in valueMap) {
            const url = valueMap.redirect.url;
            Console.debug(`redirecting to ${url}`);
            redirect(url);
            return;
        }
        if (UIDL_SECURITY_TOKEN_ID in valueMap) {
            this.#csrfToken = valueMap[UIDL_SECURITY_TOKEN_ID];
        }
        if (UIDL_PUSH_ID in valueMap) {
            this.#pushId = valueMap[UIDL_PUSH_ID];
        }
        // Before the dependencies, and not with the rest of the message: a round
        // trip that removes a stylesheet and adds the same URL back carries both,
        // and the resource loader dedupes by URL, so the add would be dropped as a
        // duplicate of the sheet this message removes and the page would end up
        // with neither.
        if ('stylesheetRemovals' in valueMap) {
            this.#processStylesheetRemovals(valueMap.stylesheetRemovals);
        }
        this.#handleDependencies(valueMap);
        runWhenEagerDependenciesLoaded(() => this.#processMessage(valueMap, lock));
    }
    #handleDependencies(inputJson) {
        Console.debug('Handling dependencies');
        const dependencies = new Map();
        for (const loadMode of ['INLINE', 'EAGER', 'LAZY']) {
            if (loadMode in inputJson) {
                dependencies.set(loadMode, inputJson[loadMode]);
            }
        }
        if (dependencies.size > 0) {
            this.#registry.getDependencyLoader().loadDependencies(dependencies);
        }
    }
    /**
     * Performs the actual processing of a server message when all dependencies
     * have been loaded.
     *
     * @param valueMap - the message payload
     * @param lock - the lock object for this response
     */
    #processMessage(valueMap, lock) {
        // Java asserts this, and its assertions are stripped from production. Here it
        // stays a warning: processing is deferred until the message's eager
        // dependencies load, and forceMessageHandling can clear the response locks
        // and handle a newer message meanwhile, which advances the last seen id. Java
        // then continues out of order and recovers, so throwing would be worse than
        // the behaviour being ported.
        const serverId = getServerId(valueMap);
        if (serverId !== UNDEFINED_SYNC_ID && serverId !== this.getLastSeenServerSyncId()) {
            Console.warn(`Processing message ${serverId} after the last seen id moved to ${this.getLastSeenServerSyncId()}`);
        }
        const start = performance.now();
        if ('timings' in valueMap) {
            this.#serverTimingInfo = valueMap.timings;
        }
        try {
            const processUidlStart = performance.now();
            if ('constants' in valueMap) {
                this.#registry.getConstantPool().importFromJson(valueMap.constants);
            }
            if ('changes' in valueMap) {
                this.#processChanges(valueMap);
            }
            if (UIDL_KEY_EXECUTE in valueMap) {
                // Invoke JS only after all tree changes and post-flush listeners added
                // during message processing (hence the doubly-nested post-flush).
                Reactive.addPostFlushListener(() => Reactive.addPostFlushListener(() => this.#registry.getExecuteJavaScriptProcessor().execute(valueMap[UIDL_KEY_EXECUTE])));
            }
            Console.debug(`handleUIDLMessage: ${Math.round(performance.now() - processUidlStart)} ms`);
            Reactive.flush();
            const meta = valueMap.meta;
            if (meta) {
                if (META_SESSION_EXPIRED in meta) {
                    if (this.#nextResponseSessionExpiredHandler !== null) {
                        this.#nextResponseSessionExpiredHandler();
                    }
                    else if (this.#registry.getUILifecycle().getState() !== UIState.TERMINATED) {
                        this.#registry.getUILifecycle().setState(UIState.TERMINATED);
                        // Delay so a pending redirect/reload is not cancelled.
                        setTimeout(() => this.#registry.getSystemErrorHandler().handleSessionExpiredError(null), SESSION_EXPIRED_HANDLING_DELAY);
                    }
                }
                else if ('appError' in meta && this.#registry.getUILifecycle().getState() !== UIState.TERMINATED) {
                    const error = meta.appError;
                    this.#registry
                        .getSystemErrorHandler()
                        .handleUnrecoverableError(error.caption, error.message, error.details, error.url, error.querySelector);
                    this.#registry.getUILifecycle().setState(UIState.TERMINATED);
                }
            }
            this.#nextResponseSessionExpiredHandler = null;
        }
        finally {
            // Mark the initial UIDL handled and end the request in finally so the UI
            // settles (ApplicationConnection.isActive returns false) even if applying
            // the message threw. In GWT the equivalent work ran inside $entry, so an
            // uncaught error never left the client perpetually "active"; here we
            // guarantee the same by not gating these on successful processing.
            this.lastProcessingTime = Math.round(performance.now() - start);
            this.totalProcessingTime += this.lastProcessingTime;
            if (!this.#initialMessageHandled) {
                this.#initialMessageHandled = true;
                const fetchStart = getFetchStartTime();
                if (fetchStart !== 0) {
                    const time = Math.round(Date.now() - fetchStart);
                    Console.debug(`First response processed ${time} ms after fetchStart`);
                }
                this.#bootstrapTime = calculateBootstrapTime();
                if (isEnabled() && this.#bootstrapTime !== -1) {
                    logBootstrapTimings();
                }
            }
            Console.debug(` Processing time was ${this.lastProcessingTime}ms`);
            this.#endRequestIfResponse(valueMap);
            this.resumeResponseHandling(lock);
            if (isEnabled()) {
                getScheduler().scheduleDeferred(() => {
                    logTimings();
                    resetProfiler();
                });
            }
        }
    }
    #processStylesheetRemovals(removals) {
        if (removals === null || removals.length === 0) {
            return;
        }
        Console.debug(`Processing ${removals.length} stylesheet removals`);
        for (const dependencyId of removals) {
            this.#removeStylesheetById(dependencyId);
        }
    }
    #removeStylesheetById(dependencyId) {
        removeStylesheetByIdFromDom(dependencyId);
        this.#registry.getResourceLoader().clearLoadedResourceById(dependencyId);
    }
    #processChanges(json) {
        const tree = this.#registry.getStateTree();
        // Error/meta responses (e.g. an unrecoverable error) carry "changes":{} — an
        // empty object, not an array. GWT's JsonArray.length() treated that as zero
        // changes; here a non-array would make `for...of` throw and abort before the
        // meta.appError handling runs, so coerce it to an empty list.
        const changes = Array.isArray(json.changes) ? json.changes : [];
        // The StateTree satisfies TreeChangeProcessor's contract.
        const updatedNodes = applyTreeChanges(tree, changes);
        if (!this.#registry.getApplicationConfiguration().isProductionMode()) {
            try {
                Console.debug('StateTree after applying changes:');
                Console.debug(tree.getRootNode().getDebugJson());
            }
            catch (e) {
                Console.error('Failed to log state tree');
                Console.error(e);
            }
        }
        Reactive.addPostFlushListener(() => 
        // Through the tracking scheduler, as Scheduler.get().scheduleDeferred is,
        // so the pending callbacks keep the application active.
        getScheduler().scheduleDeferred(() => updatedNodes.forEach((node) => this.#afterServerUpdates(node))));
    }
    #afterServerUpdates(node) {
        if (!node.isUnregistered()) {
            const domNode = node.getDomNode();
            if (domNode) {
                callAfterServerUpdates(domNode);
            }
        }
    }
    #endRequestIfResponse(json) {
        // End the request if the received message was a response, not sent
        // asynchronously.
        if (this.#isResponse(json)) {
            const requestResponseTracker = this.#registry.getRequestResponseTracker();
            if (requestResponseTracker.hasActiveRequest()) {
                requestResponseTracker.endRequest();
            }
            else {
                // No request to end, e.g. a duplicate of a response that already ended
                // it. endRequest would throw for that.
                Console.debug('Received a response while no request is active, ignoring it');
            }
            this.#registry.getLoadingIndicatorStateHandler().stopLoading();
        }
    }
    #isResponse(json) {
        const meta = json.meta;
        return !meta || !(META_ASYNC in meta);
    }
    #forceMessageHandling() {
        this.#forceHandleMessage = null;
        if (this.#responseHandlingLocks.size > 0) {
            // Lock which was never released -> bug in the locker, or things just too
            // slow
            Console.warn('WARNING: response handling was never resumed, forcibly removing locks...');
            this.#responseHandlingLocks.clear();
        }
        else {
            // Waited for an out-of-order message which never arrived. Do one final
            // check and resynchronize if the message is not there; the final check is
            // only a precaution, as this timer should have been cancelled if the
            // message had arrived.
            Console.warn(`Gave up waiting for message ${this.#ordering.getExpectedServerId()} from the server`);
        }
        if (!this.#handlePendingMessages() && !this.#ordering.isEmpty()) {
            // There are messages but the next id was not found, likely it has been
            // lost. Drop pending messages and resynchronize.
            this.#ordering.clear();
            // Inform the message sender that resynchronize is desired already, since
            // endRequest may already send out a next request.
            this.#registry.getMessageSender().requestResynchronize();
            // Clear the previous request if it exists.
            if (this.#registry.getRequestResponseTracker().hasActiveRequest()) {
                this.#registry.getRequestResponseTracker().endRequest();
            }
            // Call resynchronize to make sure a resynchronize request is sent in case
            // endRequest did not already do this.
            this.#registry.getMessageSender().resynchronize();
        }
    }
    /**
     * This method can be used to postpone rendering of a response for a short
     * period of time (e.g. to avoid the rendering process during animation).
     *
     * The Java method name is misspelled; it is kept verbatim to preserve public
     * API parity.
     *
     * @param lock - the lock
     */
    suspendReponseHandling(lock) {
        this.#responseHandlingLocks.add(lock);
    }
    /**
     * Resumes the rendering process once all locks have been removed.
     *
     * @param lock - the lock
     */
    resumeResponseHandling(lock) {
        this.#responseHandlingLocks.delete(lock);
        if (this.#responseHandlingLocks.size === 0) {
            // Cancel the timer that breaks the lock
            this.#resetForceHandleTimer();
            if (!this.#ordering.isEmpty()) {
                Console.debug('No more response handling locks, handling pending requests.');
                this.#handlePendingMessages();
            }
        }
    }
    /**
     * Finds the next pending UIDL message and handles it (next pending is decided
     * based on the server id).
     *
     * @returns true if a message was handled, false otherwise
     */
    #handlePendingMessages() {
        const index = this.#ordering.findNextHandlable();
        if (index !== -1) {
            const message = this.#ordering.remove(index);
            this.handleJSON(message);
            return true;
        }
        return false;
    }
    /**
     * Profiling data for the last response: last and total processing time, the
     * optional server timing info, and the bootstrap time. Mirrors the
     * getProfilingData JSNI in ApplicationConnection.java.
     */
    getProfilingData() {
        const data = [this.lastProcessingTime, this.totalProcessingTime];
        if (this.#serverTimingInfo !== null) {
            data.push(...this.#serverTimingInfo);
        }
        else {
            data.push(-1, -1);
        }
        data.push(this.#bootstrapTime);
        return data;
    }
    /**
     * Gets the server id included in the last received response.
     *
     * This id can be used by connectors to determine whether new data has been
     * received from the server to avoid doing the same calculations multiple times.
     *
     * No guarantees are made for the structure of the id other than that there will
     * be a new unique value every time a new response with data from the server is
     * received.
     *
     * The initial id when no request has yet been processed is -1.
     *
     * @returns an id identifying the response
     */
    getLastSeenServerSyncId() {
        return this.#ordering.getLastSeenServerSyncId();
    }
    /**
     * Gets the token (synchronizer token pattern) that the server uses to protect against
     * CSRF (Cross Site Request Forgery) attacks.
     *
     * @returns the CSRF token string
     */
    getCsrfToken() {
        return this.#csrfToken;
    }
    /**
     * Gets the push connection identifier for this session. Used when establishing a push
     * connection with the client.
     *
     * @returns the push connection identifier string
     */
    getPushId() {
        return this.#pushId;
    }
    /**
     * Checks if the first UIDL has been handled.
     *
     * @returns true if the initial UIDL has already been processed, false * otherwise
     */
    isInitialUidlHandled() {
        return this.#bootstrapTime !== 0;
    }
    /**
     * Sets a temporary handler for session expiration. This handler will be triggered if
     * and only if the next server message tells that the session has expired.
     *
     * @param handler - the handler to use or null to remove a previously set handler
     */
    setNextResponseSessionExpiredHandler(handler) {
        this.#nextResponseSessionExpiredHandler = handler;
    }
}
// Java declares parseJson between isInitialUidlHandled and
// setNextResponseSessionExpiredHandler; a module function cannot live inside the
// class body, so it follows it here.
/**
 * Parse the given wrapped JSON, received from the server, to a {@link ValueMap}.
 *
 * @param jsonText - The JSON to parse
 * @returns A ValueMap created from the JSON
 */
export function parseJson(jsonText) {
    if (jsonText === null) {
        return null;
    }
    const start = getRelativeTimeMillis();
    try {
        const json = parseJSONResponse(jsonText);
        Console.debug(`JSON parsing took ${getRelativeTimeString(start)}ms`);
        return json;
    }
    catch {
        Console.error(`Unable to parse JSON: ${jsonText}`);
        return null;
    }
}
//# sourceMappingURL=MessageHandler.js.map