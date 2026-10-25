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
import { assert } from '../../assert';
import { stringify } from '../WidgetUtil';
import { parseJson } from './MessageHandler';
import { addGetParameter } from '../../flow/shared/util/SharedUtil';
import { Console } from '../Console';
// com.vaadin.flow.shared.communication.PushConstants
const WEBSOCKET_FRAGMENT_SIZE = 16384 / 4 - 1; // 4095
const MESSAGE_DELIMITER = '|';
// com.vaadin.flow.server.Constants / shared.ApplicationConstants
const PUSH_MAPPING = 'VAADIN/push';
const VAADIN_PUSH_JS = 'VAADIN/static/push/vaadinPush-min.js';
const VAADIN_PUSH_DEBUG_JS = 'VAADIN/static/push/vaadinPush.js';
const REQUEST_TYPE_PARAMETER = 'v-r';
const REQUEST_TYPE_PUSH = 'push';
const UI_ID_PARAMETER = 'v-uiId';
const PUSH_ID_PARAMETER = 'v-pushId';
/**
 * Splits a message into websocket fragments of at most WEBSOCKET_FRAGMENT_SIZE
 * characters; the first fragment is prefixed with `<length><delimiter>` so the
 * receiver can reassemble it. Mirrors AtmospherePushConnection.FragmentedMessage.
 */
export class FragmentedMessage {
    #message;
    #index = 0;
    /**
     * Creates a new instance based on the given message.
     *
     * @param message - the message to wrap
     */
    constructor(message) {
        this.#message = message;
    }
    /**
     * Checks if there is another fragment which can be retrieved using
     * {@link FragmentedMessage.getNextFragment} or if all fragments have been
     * retrieved.
     *
     * @returns true if there is another fragment to retrieve, false otherwise
     */
    hasNextFragment() {
        return this.#index < this.#message.length;
    }
    /**
     * Gets the following fragment and increments the internal fragment counter so the
     * following call to this method will return the following fragment. This method
     * should not be called if all fragments have been received ({@link FragmentedMessage.hasNextFragment}
     * returns false).
     *
     * @returns the next fragment
     */
    getNextFragment() {
        assert(this.hasNextFragment(), 'No fragments left');
        let result;
        if (this.#index === 0) {
            const header = `${this.#message.length}${MESSAGE_DELIMITER}`;
            const fragmentLength = WEBSOCKET_FRAGMENT_SIZE - header.length;
            result = header + this.#getFragment(0, fragmentLength);
            this.#index += fragmentLength;
        }
        else {
            result = this.#getFragment(this.#index, this.#index + WEBSOCKET_FRAGMENT_SIZE);
            this.#index += WEBSOCKET_FRAGMENT_SIZE;
        }
        return result;
    }
    #getFragment(begin, end) {
        return this.#message.substring(begin, Math.min(this.#message.length, end));
    }
}
function atmosphere() {
    return window.vaadinPush?.atmosphere;
}
/** Whether the Atmosphere push library is loaded. */
function isAtmosphereLoaded() {
    return !!atmosphere();
}
/** Pushes a message over the given Atmosphere socket. */
function doPush(socket, message) {
    socket.push(message);
}
/** Unsubscribes the Atmosphere connection for the given url. */
function doDisconnect(url) {
    // Java dereferences $wnd.vaadinPush.atmosphere unconditionally here: the
    // connection only reaches a disconnect after the library has loaded.
    atmosphere().unsubscribeUrl(url);
}
/**
 * Wires the connection url and callbacks onto the Atmosphere config and
 * subscribes, returning the resulting socket. The header value supplier is
 * read on every request, so it is wrapped in a function rather than assigned
 * once.
 */
function doConnect(uri, config, callbacks) {
    config.url = uri;
    config.onOpen = callbacks.onOpen;
    config.onReopen = callbacks.onReopen;
    config.onMessage = callbacks.onMessage;
    config.onError = callbacks.onError;
    config.onTransportFailure = callbacks.onTransportFailure;
    config.onClose = callbacks.onClose;
    config.onReconnect = callbacks.onReconnect;
    config.onClientTimeout = callbacks.onClientTimeout;
    config.headers = {
        'X-Vaadin-LastSeenServerSyncId': () => callbacks.getLastSeenServerSyncId()
    };
    return atmosphere().subscribe(config);
}
// Connection states; mirrors AtmospherePushConnection.State.
const State = {
    CONNECT_PENDING: 'CONNECT_PENDING',
    CONNECTED: 'CONNECTED',
    DISCONNECT_PENDING: 'DISCONNECT_PENDING',
    DISCONNECTED: 'DISCONNECTED'
};
/** The atmosphere configuration/response key holding the transport name. */
export const TRANSPORT_KEY = 'transport';
/**
 * The default {@link PushConnection} implementation that uses Atmosphere for
 * handling the communication channel.
 *
 * Composes the Atmosphere-wiring helpers above and the FragmentedMessage
 * splitter.
 */
export class AtmospherePushConnection {
    #registry;
    #state = State.CONNECT_PENDING;
    #config;
    #socket = null;
    #pushUri = null;
    #transport = null;
    #url = '';
    #pendingDisconnectCommand = null;
    constructor(registry) {
        this.#registry = registry;
        registry.getUILifecycle().addHandler((event) => {
            if (event.getUiLifecycle().isTerminated()) {
                if (this.#state === State.DISCONNECT_PENDING || this.#state === State.DISCONNECTED) {
                    return;
                }
                this.disconnect(() => { });
            }
        });
        this.#config = this.createConfig();
        // Always debug for now.
        this.#config.logLevel = 'debug';
        this.#registry
            .getPushConfiguration()
            .getParameters()
            .forEach((value, key) => {
            if (value.toLowerCase() === 'true' || value.toLowerCase() === 'false') {
                this.#config[key] = value.toLowerCase() === 'true';
            }
            else {
                this.#config[key] = value;
            }
        });
        this.#url = this.#computePushUrl();
        this.#runWhenAtmosphereLoaded(() => setTimeout(() => this.#connect(), 0));
    }
    #getConnectionStateHandler() {
        return this.#registry.getConnectionStateHandler();
    }
    #connect() {
        let pushUrl = this.#registry.getURIResolver().resolveVaadinUri(this.#url) ?? this.#url;
        pushUrl = addGetParameter(pushUrl, REQUEST_TYPE_PARAMETER, REQUEST_TYPE_PUSH);
        pushUrl = addGetParameter(pushUrl, UI_ID_PARAMETER, this.#registry.getApplicationConfiguration().getUIId());
        const pushId = this.#registry.getMessageHandler().getPushId();
        if (pushId !== null) {
            pushUrl = addGetParameter(pushUrl, PUSH_ID_PARAMETER, pushId);
        }
        Console.debug('Establishing push connection');
        this.#pushUri = pushUrl;
        this.#socket = doConnect(pushUrl, this.#config, {
            onOpen: (response) => this.onOpen(response),
            onReopen: (response) => this.onReopen(response),
            onMessage: (response) => this.onMessage(response),
            onError: (response) => this.onError(response),
            onTransportFailure: () => this.onTransportFailure(),
            onClose: (response) => this.onClose(response),
            onReconnect: (request, response) => this.onReconnect(request, response),
            onClientTimeout: (response) => this.onClientTimeout(response),
            getLastSeenServerSyncId: () => this.#registry.getMessageHandler().getLastSeenServerSyncId()
        });
    }
    #computePushUrl() {
        const pushConfiguration = this.#registry.getPushConfiguration();
        const applicationConfiguration = this.#registry.getApplicationConfiguration();
        const pushServletMapping = pushConfiguration.getPushServletMapping();
        if (pushServletMapping === null || pushServletMapping.trim() === '' || pushServletMapping === '/') {
            // Handle null, empty and "/" mapping using just default push mapping and
            // serviceUrl.
            let url = PUSH_MAPPING;
            // If a specific serviceUrl is defined, prepend pushUrl with it.
            let serviceUrl = applicationConfiguration.getServiceUrl();
            if (serviceUrl !== '.') {
                if (!serviceUrl.endsWith('/')) {
                    serviceUrl += '/';
                }
                url = serviceUrl + url;
            }
            return url;
        }
        // Append the specific mapping directly to the context root URL.
        let mapping = pushServletMapping;
        const contextRootUrl = applicationConfiguration.getContextRootUrl();
        if (contextRootUrl.endsWith('/') && mapping.startsWith('/')) {
            mapping = mapping.substring(1);
        }
        return contextRootUrl + mapping + PUSH_MAPPING;
    }
    isActive() {
        return this.#state === State.CONNECT_PENDING || this.#state === State.CONNECTED;
    }
    isBidirectional() {
        if (this.#transport === null || this.#transport !== 'websocket') {
            // Not using websockets -> send XHRs.
            return false;
        }
        if (this.#registry.getPushConfiguration().isAlwaysXhrToServer()) {
            // The user has forced XHR.
            return false;
        }
        // CONNECT_PENDING still reports bidirectional: the message is delayed until
        // the connection is established, when bidirectionality is re-checked.
        return true;
    }
    push(message) {
        if (!this.isBidirectional()) {
            throw new Error('This server to client push connection should not be used to send client to server messages');
        }
        if (this.#state === State.CONNECTED) {
            const messageJson = stringify(message);
            Console.debug(`Sending push (${this.#transport}) message to server: ${messageJson}`);
            if (this.#transport === 'websocket') {
                const fragmented = new FragmentedMessage(messageJson);
                while (fragmented.hasNextFragment()) {
                    doPush(this.#socket, fragmented.getNextFragment());
                }
            }
            else {
                doPush(this.#socket, messageJson);
            }
            return;
        }
        if (this.#state === State.CONNECT_PENDING) {
            this.#getConnectionStateHandler().pushNotConnected(message);
            return;
        }
        throw new Error('Can not push after disconnecting');
    }
    getConfig() {
        return this.#config;
    }
    onReopen(response) {
        Console.debug(`Push connection re-established using ${response.transport}`);
        this.onConnect(response);
    }
    onOpen(response) {
        Console.debug(`Push connection established using ${response.transport}`);
        this.onConnect(response);
    }
    /**
     * Called whenever a server push connection is established (or re-established).
     *
     * @param response - the response
     */
    onConnect(response) {
        this.#transport = response.transport;
        switch (this.#state) {
            case State.CONNECT_PENDING:
                this.#state = State.CONNECTED;
                this.#getConnectionStateHandler().pushOk(this);
                break;
            case State.DISCONNECT_PENDING:
                // Connected so the pending disconnect can actually close the connection.
                this.#state = State.CONNECTED;
                assert(this.#pendingDisconnectCommand !== null, 'No pending disconnect command');
                this.disconnect(this.#pendingDisconnectCommand);
                break;
            case State.CONNECTED:
                // Some browsers open the same connection multiple times; ignore.
                break;
            default:
                throw new Error(`Got onOpen event when connection state is ${this.#state}. This should never happen.`);
        }
    }
    disconnect(command) {
        // Java asserts command != null; the parameter is non-nullable here, so the
        // check is unreachable and dropped.
        switch (this.#state) {
            case State.CONNECT_PENDING:
                // Let the connection callback initiate the disconnect once connected.
                this.#state = State.DISCONNECT_PENDING;
                this.#pendingDisconnectCommand = command;
                break;
            case State.CONNECTED:
                // Normal disconnect
                Console.debug('Closing push connection');
                doDisconnect(this.#pushUri);
                this.#state = State.DISCONNECTED;
                command();
                break;
            default:
                throw new Error('Can not disconnect more than once');
        }
    }
    /**
     * Called whenever a message is received by Atmosphere.
     *
     * @param response - the Atmosphere response object, which contains the message
     */
    onMessage(response) {
        const message = response.responseBody;
        const json = parseJson(message);
        if (json === null) {
            // Invalid JSON string
            this.#getConnectionStateHandler().pushInvalidContent(this, message);
        }
        else {
            Console.debug(`Received push (${this.getTransportType()}) message: ${message}`);
            this.#registry.getMessageHandler().handleMessage(json);
        }
    }
    onTransportFailure() {
        Console.warn('Push connection using the primary method failed. Trying the fallback transport.');
    }
    /**
     * Called if the push connection fails.
     *
     * Atmosphere will automatically retry the connection until successful.
     *
     * @param response - the Atmosphere response for the failed connection
     */
    onError(response) {
        this.#state = State.DISCONNECTED;
        this.#getConnectionStateHandler().pushError(this, response);
    }
    /**
     * Called when the push connection has been closed.
     *
     * This does not necessarily indicate an error and Atmosphere might try to
     * reconnect or downgrade to the fallback transport automatically.
     *
     * @param response - the Atmosphere response which was closed
     */
    onClose(response) {
        this.#state = State.CONNECT_PENDING;
        this.#getConnectionStateHandler().pushClosed(this, response);
    }
    /**
     * Called when the Atmosphere client side timeout occurs.
     *
     * The connection will be closed at this point and reconnect will not happen
     * automatically.
     *
     * @param response - the Atmosphere response which was used when the timeout
     *          occurred
     */
    onClientTimeout(response) {
        this.#state = State.DISCONNECTED;
        this.#getConnectionStateHandler().pushClientTimeout(this, response);
    }
    /**
     * Called when the push connection has lost the connection to the server and
     * will proceed to try to re-establish the connection.
     *
     * @param _request - the Atmosphere request
     * @param _response - the Atmosphere response
     */
    onReconnect(_request, _response) {
        if (this.#state === State.CONNECTED) {
            this.#state = State.CONNECT_PENDING;
        }
        this.#getConnectionStateHandler().pushReconnectPending(this);
    }
    /**
     * Creates the default Atmosphere configuration object.
     *
     * @returns the Atmosphere configuration object
     */
    createConfig() {
        return {
            transport: 'websocket',
            maxStreamingLength: 1000000,
            fallbackTransport: 'long-polling',
            contentType: 'application/json; charset=UTF-8',
            reconnectInterval: 5000,
            withCredentials: true,
            maxWebsocketErrorRetries: 12,
            timeout: -1,
            maxReconnectOnClose: 10000000,
            trackMessageLength: true,
            enableProtocol: true,
            handleOnlineOffline: false,
            executeCallbackBeforeReconnect: true,
            messageDelimiter: String.fromCharCode(MESSAGE_DELIMITER.charCodeAt(0))
        };
    }
    #runWhenAtmosphereLoaded(command) {
        if (isAtmosphereLoaded()) {
            command();
            return;
        }
        const pushJs = this.#registry.getApplicationConfiguration().isProductionMode()
            ? VAADIN_PUSH_JS
            : VAADIN_PUSH_DEBUG_JS;
        const pushScriptUrl = this.#registry.getApplicationConfiguration().getServiceUrl() + pushJs;
        Console.debug(`Loading ${pushJs}`);
        const listener = {
            onLoad: (event) => {
                if (isAtmosphereLoaded()) {
                    Console.debug(`${pushJs} loaded`);
                    command();
                }
                else {
                    // ResourceLoader assumes bootstrap's vaadinPush.js load succeeded even
                    // if it failed (#11673).
                    listener.onError(event);
                }
            },
            onError: (event) => {
                this.#getConnectionStateHandler().pushScriptLoadError(event.getResourceData());
            }
        };
        this.#registry.getResourceLoader().loadScript(pushScriptUrl, listener);
    }
    getTransportType() {
        return this.#transport;
    }
}
/** The default {@link PushConnectionFactory}: creates an AtmospherePushConnection. */
export const atmospherePushConnectionFactory = (registry) => new AtmospherePushConnection(registry);
//# sourceMappingURL=AtmospherePushConnection.js.map