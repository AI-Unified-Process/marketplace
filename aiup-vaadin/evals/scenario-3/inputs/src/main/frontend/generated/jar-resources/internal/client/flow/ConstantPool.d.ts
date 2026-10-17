/** Map of constant values received from the server; mirrors ConstantPool.java. */
export declare class ConstantPool {
    #private;
    /**
     * Imports new constants into this pool.
     *
     * @param json - a JSON object mapping constant keys to constant values, not
     *          `null`
     */
    importFromJson(json: Record<string, unknown>): void;
    /**
     * Checks whether this constant pool contains a value for the given key.
     *
     * @param key - the key to check, not `null`
     * @returns `true` if there is a constant for the given key; otherwise `false`
     */
    has(key: string): boolean;
    /**
     * Gets the constant with a given key.
     *
     * @param key - the key to get a constant for, not `null`
     * @typeParam T - the constant type
     * @returns the constant value, or `null` if there is no constant with the
     *          given key
     */
    get<T>(key: string): T;
}
