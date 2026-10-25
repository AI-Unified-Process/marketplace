/**
 * The storage class for set of updatable model properties.
 *
 * This class is stored inside a {@link StateNode} via
 * {@link StateNode.setNodeData} if there is any data to store at all.
 * Once it's stored in the {@link StateNode} the code which sends updates to the
 * server side when a polymer property is updated uses this data to detect
 * whether server expects the update to be sent(see
 * {@link SimpleElementBindingStrategy}).
 */
export declare class UpdatableModelProperties {
    #private;
    /**
     * Creates a new instance of storage class based on given
     * `properties`.
     *
     * @param properties - updatable properties array
     */
    constructor(properties: string[]);
    /**
     * Tests whether the `property` is updatable.
     *
     * @param property - the property to test
     * @returns `true` if property is updatable
     */
    isUpdatableProperty(property: string): boolean;
}
