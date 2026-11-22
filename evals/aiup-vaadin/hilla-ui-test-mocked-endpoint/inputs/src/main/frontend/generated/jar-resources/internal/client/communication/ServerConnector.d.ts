import type { Registry } from '../Registry';
import type { StateNode } from '../flow/StateNode';
/**
 * Handles creating and sending messages to the server using {@link
 * ServerRpcQueue}.
 */
export declare class ServerConnector {
    #private;
    /**
     * Creates a new server connector.
     *
     * @param registry - the global registry
     */
    constructor(registry: Registry);
    /**
     * Sends a navigation message to server.
     *
     * @param location - the relative location of the navigation
     * @param stateObject - the state object or `null` if none applicable
     * @param routerLinkEvent - `true` if this event was triggered by interaction
     *          with a router link; `false` if triggered by history navigation
     */
    sendNavigationMessage(location: string, stateObject: unknown, routerLinkEvent: boolean): void;
    /**
     * Sends an event message to the server.
     *
     * @param nodeOrId - the node that listened to the event
     * @param eventType - the type of event
     * @param eventData - extra data associated with the event
     */
    sendEventMessage(nodeOrId: StateNode | number, eventType: string, eventData: unknown): void;
    /**
     * Sends a template event message to the server.
     *
     * @param node - the node that listened to the event
     * @param methodName - the event handler method name to execute on the server side
     * @param argsArray - the arguments array for the method
     * @param promiseId - the promise id to use for getting the result back, or -1 if no
     *          * result is expected
     */
    sendTemplateEventMessage(node: StateNode, methodName: string, argsArray: unknown[], promiseId: number): void;
    /**
     * Sends a node value sync message to the server.
     *
     * @param node - the node to update
     * @param feature - the id of the node map feature to update
     * @param key - the map key to update
     * @param value - the new value
     */
    sendNodeSyncMessage(node: StateNode, feature: number, key: string, value: unknown): void;
    /**
     * Sends a data for attach existing element server side callback.
     *
     * @param parent - parent of the node to attach
     * @param requestedId - originally requested id of a server side node
     * @param assignedId - identifier which should be used on the server side for the
     *          element (instead of requestedId)
     * @param tagName - the requested tagName
     * @param index - the index of the element on the server side
     */
    sendExistingElementAttachToServer(parent: StateNode, requestedId: number, assignedId: number, tagName: string, index: number): void;
    /**
     * Sends a data for attach existing element with id server side callback.
     *
     * @param parent - parent of the node to attach
     * @param requestedId - originally requested id of a server side node
     * @param assignedId - identifier which should be used on the server side for the
     *          element (instead of requestedId)
     * @param id - id of requested element
     */
    sendExistingElementWithIdAttachToServer(parent: StateNode, requestedId: number, assignedId: number, id: string | null): void;
    /**
     * Sends a return channel message to the server.
     *
     * @param stateNodeId - the id of the state node that owns the channel.
     * @param channelId - the id of the channel.
     * @param args - array of arguments passed to the channel, not * `null`.
     */
    sendReturnChannelMessage(stateNodeId: number, channelId: number, args: unknown[]): void;
}
