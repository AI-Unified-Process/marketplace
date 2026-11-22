/**
 * Includes utility methods to interact with HTML storage API.
 *
 * HTML Storage helpers migrated from StorageUtil.java.
 */
/**
 * Gets an item value from the local storage, or null if absent.
 *
 * @param key - the item key
 * @returns the value of the item
 */
export declare function getLocalItem(key: string): string | null;
/**
 * Sets an item value in the local storage.
 *
 * @param key - the item key
 * @param value - the item value
 */
export declare function setLocalItem(key: string, value: string): void;
/**
 * Gets an item value from the session storage, or null if absent.
 *
 * @param key - the item key
 * @returns the value of the item
 */
export declare function getSessionItem(key: string): string | null;
/**
 * Sets an item value in the session storage.
 *
 * @param key - the item key
 * @param value - the item value
 */
export declare function setSessionItem(key: string, value: string): void;
