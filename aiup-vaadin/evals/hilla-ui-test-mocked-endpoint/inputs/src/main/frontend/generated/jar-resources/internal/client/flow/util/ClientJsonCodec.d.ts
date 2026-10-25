/**
 * Static helpers for encoding and decoding JSON.
 *
 * TypeScript port of ClientJsonCodec.java.
 *
 * The `JacksonCodec` references in the member docs below stay code spans:
 * `com.vaadin.flow.internal.JacksonCodec` is server-side and outside this
 * port's scope, so there is no ported symbol for them to link to.
 */
import type { StateNode } from '../StateNode';
import type { StateTree } from '../StateTree';
/**
 * Encodes a value for transport without type information. In JavaScript the JSON
 * representation is used as-is; only `undefined`/`null` are normalized to null
 * (the JVM-only conversions in the Java version are test scaffolding). Mirrors
 * ClientJsonCodec.encodeWithoutTypeInfo.
 *
 * @param value - the value to encode
 * @returns the value encoded as JSON
 */
export declare function encodeWithoutTypeInfo(value: unknown): unknown;
/**
 * Decodes a value encoded on the server using
 * `JacksonCodec.encodeWithoutTypeInfo`. This is a no-op in JavaScript since the
 * JSON representation can be used as-is (the JVM-only conversions in the Java
 * version are test scaffolding). Mirrors ClientJsonCodec.decodeWithoutTypeInfo.
 *
 * @param json - the JSON value to convert
 * @returns the decoded value
 */
export declare function decodeWithoutTypeInfo(json: unknown): unknown;
/**
 * Decodes a value as a {@link StateNode} encoded on the server using
 * `JacksonCodec.encodeWithTypeInfo` if it's possible. Otherwise returns `null`.
 *
 * It does the same as {@link decodeWithTypeInfo} for the encoded json value if
 * the encoded object is a {@link StateNode} except it returns the node itself
 * instead of a DOM element associated with it.
 *
 * @see {@link decodeWithTypeInfo}
 * @param tree - the state tree to use for resolving nodes and elements
 * @param json - the JSON value to decode
 * @returns the decoded state node if any
 */
export declare function decodeStateNode(tree: StateTree, json: unknown): StateNode | null;
/**
 * Decodes a value encoded on the server using
 * `JacksonCodec.encodeWithTypeInfo`: element references (`@v-node` → the DOM
 * node), return channels (`@v-return` → a callback that messages the server),
 * manifested functions (`@v-fn`), and nested objects/arrays (decoded
 * recursively); other values pass through unchanged. Mirrors
 * ClientJsonCodec.decodeWithTypeInfo.
 *
 * @param tree - the state tree to use for resolving nodes and elements
 * @param json - the JSON value to decode
 * @returns the decoded value
 */
export declare function decodeWithTypeInfo(tree: StateTree, json: unknown): unknown;
