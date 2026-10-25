/**
 * Binds and updates server object able to send notifications to the server.
 */
import type { EventRemover } from '../../../EventRemover';
import type { StateNode } from '../StateNode';
import { type ServerObject } from './ServerEventObject';
/**
 * Registers all the server event handler names found in the
 * {@link NodeFeatures.CLIENT_DELEGATE_HANDLERS} feature in the state node
 * as `serverObject.<methodName>`. Additionally listens to
 * changes in the feature and updates `$server` accordingly.
 *
 * @param element - the element to update
 * @param node - the state node containing the feature
 * @returns a handle which can be used to remove the listener for the feature
 */
export declare function bindServerEventHandlerNames(element: Element, node: StateNode): EventRemover;
/**
 * Registers all the server event handler names found in the feature with
 * the `featureId` in the {@link ServerEventObject} `object`.
 * Additionally listens to changes in the feature and updates server event
 * object accordingly.
 *
 * @param objectProvider - the provider of the event object to update
 * @param node - the state node containing the feature
 * @param featureId - the feature id which contains event handler methods
 * @param returnValue - `true` if the handler should return a promise that
 *   will reflect the server-side result; `false` to not
 *   return any value
 * @returns a handle which can be used to remove the listener for the feature
 */
export declare function bindServerEventHandlerNames(objectProvider: () => ServerObject, node: StateNode, featureId: number, returnValue: boolean): EventRemover;
