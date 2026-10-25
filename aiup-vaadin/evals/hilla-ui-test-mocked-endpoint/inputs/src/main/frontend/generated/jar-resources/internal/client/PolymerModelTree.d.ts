import type { JsonValue } from './flow/nodefeature/NodeFeature';
/**
 * Makes an attempt to convert an object into json.
 *
 * @param object - the object to convert to json
 * @returns json from object, `null` for null
 */
export declare function createModelTree(object: unknown): JsonValue;
