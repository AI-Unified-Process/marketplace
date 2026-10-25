import type { StateNode } from '../StateNode';
export type ServerObject = Record<string, any>;
/**
 * Defines a method with the given name to be a callback to the server for the
 * given state node.
 *
 * Note! If the Polymer.Element contains an implementation for `methodName` it
 * will be run before the server-side method.
 *
 * @param serverObject - the $server object the method is defined on
 * @param methodName - the name of the method to add
 * @param node - the node to use as an identifier when sending an event to the
 *            server
 * @param returnPromise - `true` if the handler should return a promise that
 *            will reflect the server-side result; `false` to not return any
 *            value
 */
export declare function defineMethod(serverObject: ServerObject, methodName: string, node: StateNode, returnPromise: boolean): void;
/**
 * Removes a method with the given name.
 *
 * @param serverObject - the $server object the method is defined on
 * @param methodName - the name of the method to remove
 */
export declare function removeMethod(serverObject: ServerObject, methodName: string): void;
/**
 * Gets the defined methods.
 *
 * @param serverObject - the $server object the method is defined on
 * @returns an array of defined method names
 */
export declare function getMethods(serverObject: ServerObject): string[];
/**
 * Gets or creates `element.$server` for the given element.
 *
 * @param element - the element to use
 * @returns a reference to the `$server` object in the element
 */
export declare function get(element: Element): ServerObject;
/**
 * Gets or creates `element.$server` for the given element, if present.
 *
 * @param node - the element to use
 * @returns a reference to the `$server` object in the element, or `null` if
 *         note present.
 */
export declare function getIfPresent(node: Node): ServerObject | null;
/**
 * Reject all promises pending on this server object. Called during client
 * resynchronization to free consumers of promises that are never delivered by
 * the server.
 *
 * @param serverObject - the $server object the method is defined on
 */
export declare function rejectPromises(serverObject: ServerObject): void;
