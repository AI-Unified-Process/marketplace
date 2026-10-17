/**
 * Utility methods which are related to client side code only.
 *
 * TypeScript port of WidgetUtil.java.
 *
 * WidgetUtil.crazyJsCast and crazyJsoCast are intentionally not ported: they are
 * GWT-compiler-only artifacts whose sole purpose is to make the Java compiler
 * accept an unchecked cast. TypeScript casts are erased at runtime and its type
 * system needs no such trick, so they have no runtime or type-system equivalent.
 */
/** Refreshes the browser. */
export declare function refresh(): void;
/**
 * Redirects the browser to the given URL, or reloads the page when `url` is
 * null.
 *
 * @param url - The url to redirect to or null to refresh
 */
export declare function redirect(url: string | null): void;
/**
 * Resolves a relative URL to an absolute URL based on the current document's
 * location.
 *
 * @param url - a string with the relative URL to resolve
 * @returns the corresponding absolute URL as a string
 */
export declare function getAbsoluteUrl(url: string): string;
/**
 * Detects whether a URL is absolute. URLs without a scheme but starting with
 * double slashes (e.g. `//myhost/path`) are considered absolute.
 *
 * @param url - a string with the URL to check
 * @returns true if the url is absolute, otherwise false.
 */
export declare function isAbsoluteUrl(url: string): boolean;
/**
 * Converts a value to an indented JSON string, skipping the GWT hashCode field
 * ($H) that may be present on objects.
 *
 * @param value - the JSON value to stringify
 * @returns the JSON string
 */
export declare function toPrettyJson(value: unknown): string;
/**
 * Sets the given attribute to the value on the element, or removes it when the
 * value is null. Mirrors WidgetUtil.updateAttribute.
 *
 * @param element - the DOM element owning attribute
 * @param attribute - the attribute to update
 * @param value - the value to update
 */
export declare function updateAttribute(element: Element, attribute: string, value: string | null): void;
/**
 * Assigns a value as a JavaScript property of an object.
 *
 * @param object - the target object
 * @param name - the property name
 * @param value - the property value
 */
export declare function setJsProperty(object: Record<string, unknown>, name: string, value: unknown): void;
/**
 * Retrieves the value of a JavaScript property.
 *
 * @param object - the target object
 * @param name - the property name
 * @returns the value
 */
export declare function getJsProperty(object: Record<string, unknown>, name: string): unknown;
/**
 * Checks whether the object itself has a JavaScript property with the given
 * name. Inherited properties are not taken into account.
 *
 * @see {@link hasJsProperty}
 *
 * @param object - the target object
 * @param name - the name of the property
 * @returns `true` if the object itself has the named property; `false` if it doesn't have the property of if the property is inherited
 */
export declare function hasOwnJsProperty(object: object, name: string): boolean;
/**
 * Checks whether the object has or inherits a JavaScript property with the
 * given name.
 *
 * @see {@link hasOwnJsProperty}
 *
 * @param object - the target object
 * @param name - the name of the property
 * @returns `true` if the object itself has or inherits the named property; `false` otherwise
 */
export declare function hasJsProperty(object: object, name: string): boolean;
/**
 * Checks whether the value is explicitly undefined (null returns false).
 *
 * @param value - the value to be verified
 * @returns `true` is the value is explicitly undefined, `false` otherwise
 */
export declare function isUndefined(value: unknown): boolean;
/**
 * Removes a JavaScript property from an object.
 *
 * @param object - the object from which to remove the property
 * @param name - the name of the property to remove
 */
export declare function deleteJsProperty(object: Record<string, unknown>, name: string): void;
/**
 * Creates a new object without any JavaScript prototype. Relevant only for
 * objects displayed through the browser console.
 *
 * @returns a new json object
 */
export declare function createJsonObjectWithoutPrototype(): object;
/**
 * Creates a new object with the default JavaScript prototype.
 *
 * @returns a new json object
 */
export declare function createJsonObject(): object;
/**
 * Gets the boolean value of the given value based on JavaScript semantics.
 *
 * @param value - the value to check for truthness
 * @returns `true` if the provided value is trueish according to JavaScript semantics, otherwise `false`
 */
export declare function isTrueish(value: unknown): boolean;
/**
 * Gets all own enumerable JavaScript property names (Object.keys) of the object.
 *
 * @param value - the value to get keys for
 * @returns an array of key names
 */
export declare function getKeys(value: object): string[];
/**
 * Serializes a JSON object, throwing if it contains a DOM node reference: such
 * references must not be sent to the server and can cause cyclic dependencies.
 *
 * @param payload - JsonObject to stringify
 * @returns json string of given object
 */
export declare function stringify(payload: object): string;
/**
 * Checks whether the objects are equal either as Java objects (considering
 * types and identity) or as JS values. In TypeScript the Java `Objects.equals`
 * check maps to reference/value identity, which is OR-ed with the loose JS
 * equality of {@link equalsInJS}.
 *
 * @param obj1 - an object
 * @param obj2 - an object to be compared with `a` for deep equality
 * @returns `true` if the arguments are equal to each other and `false` otherwise
 *
 * @see {@link equalsInJS}
 */
export declare function equals(obj1: unknown, obj2: unknown): boolean;
/**
 * Checks whether the values are equal as JavaScript values, using JS `==`. This
 * ignores types, so e.g. an empty string equals 0.
 *
 * @param obj1 - an object
 * @param obj2 - an object to be compared with `a` for deep equality
 * @returns `true` if the arguments are equal via JS `==` to each other and `false` otherwise
 */
export declare function equalsInJS(obj1: unknown, obj2: unknown): boolean;
