/**
 * Various node properties' ids.
 *
 * For internal use only. May be renamed or removed in a future release.
 *
 * TypeScript port of com.vaadin.flow.internal.nodefeature.NodeProperties,
 * containing only the entries the ported client code needs so far. Absent Java
 * keys (e.g. `ID`) are added as later ports start to require them.
 *
 * The per-member Javadoc below references server-side classes (e.g.
 * `ElementData`, `VirtualChildrenList`) from `com.vaadin.flow.internal.nodefeature`,
 * outside this port's scope, so those references stay code spans permanently.
 */
export declare const NodeProperties: {
    /**
     * Key for `ElementData#getTag()`.
     */
    readonly TAG: "tag";
    /**
     * Key for `ElementData#getNamespace()`.
     */
    readonly NAMESPACE: "namespace";
    /**
     * Key for `ElementData#getPayload()`.
     */
    readonly PAYLOAD: "payload";
    /**
     * Key for `ElementData#getJavaClass()`.
     */
    readonly JAVA_CLASS: "jc";
    /**
     * Key for `TextNodeMap#getText()`.
     */
    readonly TEXT: "text";
    /**
     * Key for `ShadowRootData`.
     */
    readonly SHADOW_ROOT: "shadowRoot";
    /**
     * Key for `BasicTypeValue#getValue()`.
     */
    readonly VALUE: "value";
    /**
     * JsonObject type key for `VirtualChildrenList`.
     */
    readonly TYPE: "type";
    /**
     * JsonObject in-memory type value for `VirtualChildrenList`.
     */
    readonly IN_MEMORY_CHILD: "inMemory";
    /**
     * JsonObject `@id` type value for `VirtualChildrenList`.
     */
    readonly INJECT_BY_ID: "@id";
    /**
     * JsonObject `@name` type value for `VirtualChildrenList`.
     */
    readonly INJECT_BY_NAME: "@name";
    /**
     * JsonObject template-in-template type value for `VirtualChildrenList`.
     */
    readonly TEMPLATE_IN_TEMPLATE: "subTemplate";
    /**
     * Key for `ElementData#isVisible()`.
     */
    readonly VISIBLE: "visible";
    /**
     * The property value used on the client side only in addition to
     * {@link NodeProperties.VISIBLE}.
     */
    readonly VISIBILITY_BOUND_PROPERTY: "bound";
    /**
     * The property used on the client side only in addition to
     * {@link NodeProperties.VISIBLE}. Stores the client side value of "hidden"
     * property.
     */
    readonly VISIBILITY_HIDDEN_PROPERTY: "hidden";
    /**
     * The property used on the client side only in addition to
     * {@link NodeProperties.VISIBLE}. It stores the client side value of the CSS
     * "display" property to be able to restore when making a hidden element
     * visible again. Used only when the element is inside a shadow root, and the
     * CSS "display: none" is set in addition the "hidden" attribute.
     */
    readonly VISIBILITY_STYLE_DISPLAY_PROPERTY: "styleDisplay";
    /**
     * The property in Json object which marks the object as special value
     * transmitting URI (not just any string).
     *
     * Used in the `ElementAttributeMap`.
     */
    readonly URI_ATTRIBUTE: "uri";
    /**
     * The "slot" attribute, which should be sent to the client and applied to
     * the DOM element even when the element is initially invisible. This is a
     * structural attribute needed for CSS selectors and layout.
     */
    readonly SLOT_ATTRIBUTE: "slot";
};
