/**
 * Application is connected to server: last transaction over the wire (XHR /
 * heartbeat / endpoint call) was successful.
 */
export declare const CONNECTED = "connected";
/**
 * Application is connected and Flow is loading application state from the
 * server, or Fusion is waiting for an endpoint call to return.
 */
export declare const LOADING = "loading";
/**
 * Application has been temporarily disconnected from the server because the last
 * transaction over the wire (XHR / heartbeat / endpoint call) resulted in a
 * network error, or the browser has received the 'online' event and needs to
 * verify reconnection with the server. Flow is attempting to reconnect a
 * configurable number of times before giving up.
 */
export declare const RECONNECTING = "reconnecting";
/**
 * Application has been permanently disconnected due to browser receiving the
 * 'offline' event, or the server not being reached after a number of reconnect
 * attempts.
 */
export declare const CONNECTION_LOST = "connection-lost";
/**
 * GWT interface to ConnectionIndicator.ts
 *
 * @param state - the connection state
 */
export declare function setState(state: string): void;
/**
 * Get the connection state.
 *
 * @returns the connection state, or `null` when no connection-state component
 *          is available
 */
export declare function getState(): string | null;
/**
 * Set a property of the connection indicator component.
 *
 * @param property - the property to set
 * @param value - the value to set
 */
export declare function setProperty(property: string, value: unknown): void;
/** Notifies the connection state that a loading operation has started. */
export declare function loadingStarted(): void;
/** Notifies the connection state that a loading operation has finished. */
export declare function loadingFinished(): void;
/** Notifies the connection state that a loading operation has failed. */
export declare function loadingFailed(): void;
