import type { Registry } from '../Registry';
import type { PushConnectionFactory } from './PushConnectionFactory';
type Payload = Record<string, unknown>;
/** The state of a resynchronization request; mirrors MessageSender.ResynchronizationState. */
export declare const ResynchronizationState: {
    readonly NOT_ACTIVE: "NOT_ACTIVE";
    readonly SEND_TO_SERVER: "SEND_TO_SERVER";
    readonly WAITING_FOR_RESPONSE: "WAITING_FOR_RESPONSE";
};
export type ResynchronizationState = (typeof ResynchronizationState)[keyof typeof ResynchronizationState];
/**
 * MessageSender is responsible for sending messages to the server.
 *
 * Internally uses {@link XhrConnection} and/or {@link PushConnection} for
 * delivering messages, depending on the application configuration.
 */
export declare class MessageSender {
    #private;
    /**
     * Creates a new instance connected to the given registry.
     *
     * @param registry - the global registry
     */
    constructor(registry: Registry, pushConnectionFactory?: PushConnectionFactory | null);
    sendUnloadBeacon(): void;
    /**
     * Sends any pending invocations to the server if there is no request in
     * progress and the application is running.
     */
    sendInvocationsToServer(): void;
    /**
     * Sends an asynchronous or synchronous UIDL request to the server using the
     * given URI.
     *
     * Java overloads `send` for this: the two-argument overload is `protected` and
     * the one-argument one, ported as `send`, is `public`. TypeScript cannot give
     * two overloads different visibility, so the protected one keeps this name.
     *
     * @param reqInvocations - Data containing RPC invocations and all related
     *          information.
     * @param extraJson - Parameters that are added to the payload
     */
    protected sendRequest(reqInvocations: unknown[], extraJson: Payload | null): void;
    /**
     * Sends an asynchronous or synchronous UIDL request to the server using the
     * given URI. Adds message to message queue and postpones sending if queue not
     * empty.
     *
     * @param payload - The contents of the request to send
     */
    send(payload: Payload): void;
    /**
     * Sets the status for the push connection.
     *
     * @param enabled - `true` to enable the push connection; `false` to disable
     *          the push connection.
     * @param reEnableIfNeeded - whether a disable that finds the configuration
     *          still enabling push may re-enable it; `false` on the recursive call
     */
    setPushEnabled(enabled: boolean, reEnableIfNeeded?: boolean): void;
    /**
     * Returns a human readable string representation of the method used to
     * communicate with the server.
     *
     * @returns A string representation of the current transport type
     */
    getCommunicationMethodName(): string;
    /**
     * Resynchronize the client side, i.e. reload all component hierarchy and state
     * from the server
     */
    resynchronize(): void;
    /**
     * Used internally to update what id the server expects.
     *
     * @param nextExpectedId - the new client id to set
     * @param force - true if the id must be updated, false otherwise
     */
    setClientToServerMessageId(nextExpectedId: number, force: boolean): void;
    /**
     * Modifies the resynchronize state to indicate that resynchronization is
     * desired
     *
     * @returns true if the resynchronize request still needs to be sent; false
     *          otherwise
     */
    requestResynchronize(): boolean;
    clearResynchronizationState(): void;
    getResynchronizationState(): ResynchronizationState;
    hasQueuedMessages(): boolean;
}
/**
 * Sends the `payload` to the `url` as a beacon, surviving page unload.
 *
 * @param url - the url to send the payload to
 * @param payload - the payload to send
 */
export declare function sendBeacon(url: string, payload: string): void;
export {};
