/*
 * Copyright 2000-2026 Vaadin Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */
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
export function refresh() {
    redirect(null);
}
/**
 * Redirects the browser to the given URL, or reloads the page when `url` is
 * null.
 *
 * @param url - The url to redirect to or null to refresh
 */
export function redirect(url) {
    if (url) {
        window.location.href = url;
    }
    else {
        window.location.reload();
    }
}
/**
 * Resolves a relative URL to an absolute URL based on the current document's
 * location.
 *
 * @param url - a string with the relative URL to resolve
 * @returns the corresponding absolute URL as a string
 */
export function getAbsoluteUrl(url) {
    const anchor = document.createElement('a');
    anchor.href = url;
    return anchor.href;
}
/**
 * Detects whether a URL is absolute. URLs without a scheme but starting with
 * double slashes (e.g. `//myhost/path`) are considered absolute.
 *
 * @param url - a string with the URL to check
 * @returns true if the url is absolute, otherwise false.
 */
export function isAbsoluteUrl(url) {
    return /^(?:[a-zA-Z]+:)?\/\//.test(url);
}
/**
 * Converts a value to an indented JSON string, skipping the GWT hashCode field
 * ($H) that may be present on objects.
 *
 * @param value - the JSON value to stringify
 * @returns the JSON string
 */
export function toPrettyJson(value) {
    return JSON.stringify(value, (key, val) => (key === '$H' ? undefined : val), 4);
}
/**
 * Sets the given attribute to the value on the element, or removes it when the
 * value is null. Mirrors WidgetUtil.updateAttribute.
 *
 * @param element - the DOM element owning attribute
 * @param attribute - the attribute to update
 * @param value - the value to update
 */
export function updateAttribute(element, attribute, value) {
    if (value === null) {
        element.removeAttribute(attribute);
    }
    else {
        element.setAttribute(attribute, value);
    }
}
/**
 * Assigns a value as a JavaScript property of an object.
 *
 * @param object - the target object
 * @param name - the property name
 * @param value - the property value
 */
export function setJsProperty(object, name, value) {
    object[name] = value;
}
/**
 * Retrieves the value of a JavaScript property.
 *
 * @param object - the target object
 * @param name - the property name
 * @returns the value
 */
export function getJsProperty(object, name) {
    return object[name];
}
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
export function hasOwnJsProperty(object, name) {
    return Object.prototype.hasOwnProperty.call(object, name);
}
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
export function hasJsProperty(object, name) {
    return name in object;
}
/**
 * Checks whether the value is explicitly undefined (null returns false).
 *
 * @param value - the value to be verified
 * @returns `true` is the value is explicitly undefined, `false` otherwise
 */
export function isUndefined(value) {
    return value === undefined;
}
/**
 * Removes a JavaScript property from an object.
 *
 * @param object - the object from which to remove the property
 * @param name - the name of the property to remove
 */
export function deleteJsProperty(object, name) {
    // Dynamic delete is intentional: this helper removes an arbitrary property.
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete object[name];
}
/**
 * Creates a new object without any JavaScript prototype. Relevant only for
 * objects displayed through the browser console.
 *
 * @returns a new json object
 */
export function createJsonObjectWithoutPrototype() {
    return Object.create(null);
}
/**
 * Creates a new object with the default JavaScript prototype.
 *
 * @returns a new json object
 */
export function createJsonObject() {
    return {};
}
/**
 * Gets the boolean value of the given value based on JavaScript semantics.
 *
 * @param value - the value to check for truthness
 * @returns `true` if the provided value is trueish according to JavaScript semantics, otherwise `false`
 */
export function isTrueish(value) {
    return !!value;
}
/**
 * Gets all own enumerable JavaScript property names (Object.keys) of the object.
 *
 * @param value - the value to get keys for
 * @returns an array of key names
 */
export function getKeys(value) {
    return Object.keys(value);
}
/**
 * Serializes a JSON object, throwing if it contains a DOM node reference: such
 * references must not be sent to the server and can cause cyclic dependencies.
 *
 * @param payload - JsonObject to stringify
 * @returns json string of given object
 */
export function stringify(payload) {
    return JSON.stringify(payload, (_key, value) => {
        if (value instanceof Node) {
            throw new Error('Message JsonObject contained a dom node reference which should not be sent to the server and can cause a cyclic dependecy.');
        }
        return value;
    });
}
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
export function equals(obj1, obj2) {
    return obj1 === obj2 || equalsInJS(obj1, obj2);
}
/**
 * Checks whether the values are equal as JavaScript values, using JS `==`. This
 * ignores types, so e.g. an empty string equals 0.
 *
 * @param obj1 - an object
 * @param obj2 - an object to be compared with `a` for deep equality
 * @returns `true` if the arguments are equal via JS `==` to each other and `false` otherwise
 */
export function equalsInJS(obj1, obj2) {
    // Loose equality is intentional here; that is the contract of this helper.
    return obj1 == obj2;
}
//# sourceMappingURL=WidgetUtil.js.map