import type { ValueMap } from '../ValueMap';
export interface ConfigObject {
    getConfig(name: string): unknown;
}
/**
 * Reads a configuration parameter as a string. Please note that the
 * javascript value of the parameter should also be a string, or else an
 * undefined exception may be thrown.
 *
 * @param name - name of the configuration parameter
 * @returns value of the configuration parameter, or `null` if not defined
 */
export declare function getConfigString(config: ConfigObject, name: string): string | null;
/**
 * Reads a configuration parameter as a {@link ValueMap}. Please note that
 * the javascript value of the parameter should also be a javascript object,
 * or else an undefined exception may be thrown.
 *
 * @param name - name of the configuration parameter
 * @returns value of the configuration parameter, or `null`if not defined
 */
export declare function getConfigValueMap(config: ConfigObject, name: string): ValueMap | null;
/**
 * Reads a configuration parameter as a String array.
 *
 * @param name - name of the configuration parameter
 * @returns value of the configuration parameter, or `null`if not defined
 */
export declare function getConfigStringArray(config: ConfigObject, name: string): unknown;
/**
 * Reads a configuration parameter as a boolean.
 *
 * Please note that the javascript value of the parameter should also be a
 * boolean, or else an undefined exception may be thrown.
 *
 * @param name - name of the configuration parameter
 * @returns the boolean value of the configuration parameter, or <code>false</code> if no value is defined
 */
export declare function getConfigBoolean(config: ConfigObject, name: string): boolean;
/**
 * Reads a configuration parameter as an integer object. Please note that
 * the javascript value of the parameter should also be an integer, or else
 * an undefined exception may be thrown.
 *
 * @param config - the bootstrap configuration object
 * @param name - name of the configuration parameter
 * @returns integer value of the configuration parameter, or `null` if no value
 *          is defined
 */
export declare function getConfigInteger(config: ConfigObject, name: string): number | null;
/**
 * Reads a configuration parameter as an `ErrorMessage` object. Please
 * note that the javascript value of the parameter should also be an object
 * with appropriate fields, or else an undefined exception may be thrown
 * when calling this method or when calling methods on the returned object.
 *
 * @param name - name of the configuration parameter
 * @returns error message with the given name, or `null` if no value is defined
 */
export declare function getConfigError(config: ConfigObject, name: string): unknown;
/**
 * Gets the version of the Vaadin framework used on the server.
 *
 * @returns a string with the version
 */
export declare function getVaadinVersion(config: ConfigObject): string | null;
/**
 * Gets the version of the Atmosphere framework.
 *
 * @returns a string with the version
 */
export declare function getAtmosphereVersion(config: ConfigObject): string | null;
/**
 * Gets the JS version used in the Atmosphere framework.
 *
 * @returns a string with the version
 */
export declare function getAtmosphereJSVersion(): string | null;
/**
 * Gets the initial UIDL from the bootstrap page.
 *
 * @param config - the bootstrap configuration object
 * @returns the initial UIDL
 */
export declare function getUIDL(config: ConfigObject): ValueMap | null;
