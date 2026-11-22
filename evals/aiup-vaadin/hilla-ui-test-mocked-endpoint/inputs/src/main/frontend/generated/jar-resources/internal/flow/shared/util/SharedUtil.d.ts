/**
 * Misc internal utility methods used by both the server and the client package.
 *
 * TypeScript port of the full public API of
 * com.vaadin.flow.shared.util.SharedUtil, built alongside the Java version.
 * Java-private helpers are kept as non-exported module-local functions.
 */
/**
 * Trims trailing slashes (if any) from a string.
 *
 * @param value - The string value to be trimmed. Cannot be null.
 * @returns String value without trailing slashes.
 */
export declare function trimTrailingSlashes(value: string): string;
/**
 * Splits a camelCaseString into an array of words with the casing preserved.
 *
 * @param camelCaseString - The input string in camelCase format
 * @returns An array with one entry per word in the input string
 */
export declare function splitCamelCase(camelCaseString: string): string[];
/**
 * Converts a camelCaseString to a human friendly format (Camel case string).
 * In general splits words when the casing changes but also handles special
 * cases such as consecutive upper case characters. Examples:
 * `MyBeanContainer` becomes `My Bean Container`, `AwesomeURLFactory` becomes
 * `Awesome URL Factory`, `SomeUriAction` becomes `Some Uri Action`.
 *
 * @param camelCaseString - The input string in camelCase format
 * @returns A human friendly version of the input
 */
export declare function camelCaseToHumanFriendly(camelCaseString: string): string;
/**
 * Joins the words in the input array together into a single string by
 * inserting the separator string between each word.
 *
 * @param parts - The array of words
 * @param separator - The separator string to use between words
 * @returns The constructed string of words and separators
 */
export declare function join(parts: string[], separator: string): string;
/**
 * Capitalizes the first character in the given string in a way suitable for
 * use in code (methods, properties etc).
 *
 * @param string - The string to capitalize
 * @returns The capitalized string
 */
export declare function capitalize(string: string | null): string | null;
/**
 * Changes the first character in the given string to lower case in a way
 * suitable for use in code (methods, properties etc).
 *
 * @param string - The string to change
 * @returns The string with initial character turned into lower case
 */
export declare function firstToLower(string: string | null): string | null;
/**
 * Converts a property id to a human friendly format. Handles nested
 * properties by only considering the last part, e.g. "address.streetName" is
 * equal to "streetName" for this method.
 *
 * @param propertyId - The propertyId to format
 * @returns A human friendly version of the property id
 */
export declare function propertyIdToHumanFriendly(propertyId: unknown): string;
/**
 * Adds a single `parameter=value` query parameter to a URI. Mirrors
 * SharedUtil.addGetParameter.
 *
 * @param uri - the URI to which the parameter should be added.
 * @param parameter - the name of the parameter
 * @param value - the value of the parameter
 * @returns The modified URI with the parameter added
 */
export declare function addGetParameter(uri: string, parameter: string, value: string | number): string;
/**
 * Adds the given query parameters to a URI, before any fragment. Mirrors
 * SharedUtil.addGetParameters.
 *
 * @param uri - The uri to which the parameters should be added.
 * @param extraParams - One or more parameters in the format "a=b" or "c=d&e=f". An empty string is allowed but will not modify the url.
 * @returns The modified URI with the get parameters in extraParams added.
 */
export declare function addGetParameters(uri: string, extraParams: string | null): string;
/**
 * Converts a dash ("-") separated string into camelCase. Examples: `foo`
 * becomes `foo`, `foo-bar` becomes `fooBar`, `foo--bar` becomes `fooBar`.
 *
 * @param dashSeparated - The dash separated string to convert
 * @returns a camelCase version of the input string
 */
export declare function dashSeparatedToCamelCase(dashSeparated: string | null): string | null;
/**
 * Converts a camelCase string into dash ("-") separated. Examples: `foo`
 * becomes `foo`, `fooBar` becomes `foo-bar`, `MyBeanContainer` becomes
 * `-my-bean-container`, `AwesomeURLFactory` becomes `-awesome-uRL-factory`,
 * `someUriAction` becomes `some-uri-action`.
 *
 * @param camelCaseString - The input string in camelCase format
 * @returns A dash separated version of the input
 */
export declare function camelCaseToDashSeparated(camelCaseString: string | null): string | null;
/**
 * Converts a UpperCamelCase string into dash ("-") separated lowercase.
 * Examples: `foo` becomes `foo`, `fooBar` becomes `foo-bar`,
 * `MyBeanContainer` becomes `my-bean-container`, `AwesomeURLFactory` becomes
 * `awesome-url-factory`, `someUriAction` becomes `some-uri-action`.
 *
 * @param upperCamelCaseString - The input string in UpperCamelCase format
 * @returns A dash separated lowercase version of the input
 */
export declare function upperCamelCaseToDashSeparatedLowerCase(upperCamelCaseString: string | null): string | null;
/**
 * Prepend the given url with the prefix if it is not absolute and doesn't have
 * a protocol.
 *
 * @param url - url to check
 * @param prefix - prefix to add to url
 * @returns prefixed url or url if absolute or has a protocol
 */
export declare function prefixIfRelative(url: string, prefix: string): string;
