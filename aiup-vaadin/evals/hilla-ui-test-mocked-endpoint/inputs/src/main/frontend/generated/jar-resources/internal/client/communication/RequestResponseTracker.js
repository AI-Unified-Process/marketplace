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
import { ReconnectionAttemptEvent } from './ReconnectionAttemptEvent';
import { RequestStartingEvent } from './RequestStartingEvent';
import { ResponseHandlingEndedEvent } from './ResponseHandlingEndedEvent';
import { ResponseHandlingStartedEvent } from './ResponseHandlingStartedEvent';
import { ResynchronizationState } from './MessageSender';
function addListener(listeners, listener) {
    listeners.push(listener);
    return {
        remove: () => {
            const index = listeners.indexOf(listener);
            if (index !== -1) {
                listeners.splice(index, 1);
            }
        }
    };
}
/** Tracks active server UIDL requests and fires their lifecycle events; mirrors RequestResponseTracker.java. */
export class RequestResponseTracker {
    #hasActiveRequestState = false;
    #registry;
    #requestStartingHandlers = [];
    #responseHandlingStartedHandlers = [];
    #responseHandlingEndedHandlers = [];
    #reconnectionAttemptHandlers = [];
    /**
     * Creates a new instance connected to the given registry.
     *
     * @param registry - the global registry
     */
    constructor(registry) {
        this.#registry = registry;
    }
    /** Marks that a new request has started and fires the request-starting event. */
    startRequest() {
        if (this.#hasActiveRequestState) {
            throw new Error('Trying to start a new request while another is active');
        }
        this.#hasActiveRequestState = true;
        // Iterate a copy, as SimpleEventBus does, so a handler added or removed
        // during dispatch does not change who is notified for this event.
        const event = new RequestStartingEvent();
        [...this.#requestStartingHandlers].forEach((handler) => handler(event));
    }
    /**
     * Checks is there is an active UIDL request.
     *
     * @returns true if there is an active request, false otherwise
     */
    hasActiveRequest() {
        return this.#hasActiveRequestState;
    }
    /**
     * Marks that the current request has ended, sending any pending invocations
     * and firing the response-handling-ended event.
     */
    endRequest() {
        if (!this.#hasActiveRequestState) {
            throw new Error('endRequest called when no request is active');
        }
        // After sendInvocationsToServer() there may be a new active request, so the
        // flag must be cleared before, not after, the call.
        this.#hasActiveRequestState = false;
        const messageSender = this.#registry.getMessageSender();
        if ((this.#registry.getUILifecycle().isRunning() && this.#registry.getServerRpcQueue().isFlushPending()) ||
            messageSender.getResynchronizationState() === ResynchronizationState.SEND_TO_SERVER ||
            messageSender.hasQueuedMessages()) {
            // Send the pending RPCs immediately. This might be an unnecessary
            // optimization, as ServerRpcQueue has a finally-scheduled command which
            // triggers the send if we do not do it here.
            messageSender.sendInvocationsToServer();
        }
        const event = new ResponseHandlingEndedEvent();
        [...this.#responseHandlingEndedHandlers].forEach((handler) => handler(event));
    }
    /** Fires the response-handling-started event (called by the message handler). */
    fireResponseHandlingStarted() {
        const event = new ResponseHandlingStartedEvent();
        [...this.#responseHandlingStartedHandlers].forEach((handler) => handler(event));
    }
    /** Fires a reconnection-attempt event with the attempt count. */
    fireReconnectionAttempt(attempt) {
        const event = new ReconnectionAttemptEvent(attempt);
        [...this.#reconnectionAttemptHandlers].forEach((handler) => handler(event));
    }
    /**
     * Adds a handler for {@link RequestStartingEvent}s.
     *
     * @param handler - the handler to add
     * @returns a registration object which can be used to remove the handler
     */
    addRequestStartingHandler(handler) {
        return addListener(this.#requestStartingHandlers, handler);
    }
    /**
     * Adds a handler for {@link ResponseHandlingStartedEvent}s.
     *
     * @param handler - the handler to add
     * @returns a registration object which can be used to remove the handler
     */
    addResponseHandlingStartedHandler(handler) {
        return addListener(this.#responseHandlingStartedHandlers, handler);
    }
    /**
     * Adds a handler for {@link ResponseHandlingEndedEvent}s.
     *
     * @param handler - the handler to add
     * @returns a registration object which can be used to remove the handler
     */
    addResponseHandlingEndedHandler(handler) {
        return addListener(this.#responseHandlingEndedHandlers, handler);
    }
    /**
     * Adds a handler for {@link ReconnectionAttemptEvent}s.
     *
     * @param handler - the handler to add
     * @returns a registration object which can be used to remove the handler
     */
    addReconnectionAttemptHandler(handler) {
        return addListener(this.#reconnectionAttemptHandlers, handler);
    }
}
//# sourceMappingURL=RequestResponseTracker.js.map