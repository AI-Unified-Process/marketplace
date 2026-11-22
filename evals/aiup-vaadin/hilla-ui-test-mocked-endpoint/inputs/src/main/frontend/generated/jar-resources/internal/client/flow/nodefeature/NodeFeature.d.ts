import type { StateNode } from '../StateNode';
/** A JSON value, mirroring elemental.json.JsonValue in loose form. */
export type JsonValue = unknown;
/**
 * Holder of the actual data in a state node. The state node data is isolated
 * into different features of related data.
 */
export declare abstract class NodeFeature {
    #private;
    /**
     * Creates a new feature.
     *
     * @param id - the id of the feature
     * @param node - the node that the feature belongs to
     */
    constructor(id: number, node: StateNode);
    /**
     * Gets the id of this feature.
     *
     * @returns the id
     */
    getId(): number;
    /**
     * Gets the node of this feature.
     *
     * @returns the node
     */
    getNode(): StateNode;
    /**
     * Gets a JSON object representing the contents of this feature. Only
     * intended for debugging purposes.
     *
     * @returns a JSON representation
     */
    abstract getDebugJson(): JsonValue;
    /**
     * Convert the feature values into a {@link JsonValue} using provided
     * `converter` for the values stored in the feature (i.e. primitive types,
     * StateNodes).
     *
     * @param converter - converter to convert values stored in the feature
     * @returns resulting converted value
     */
    abstract convert(converter: (value: unknown) => JsonValue): JsonValue;
    /**
     * Helper for getting a JSON representation of a child value.
     *
     * @param value - the child value
     * @returns the JSON representation
     */
    protected getAsDebugJson(value: unknown): JsonValue;
}
