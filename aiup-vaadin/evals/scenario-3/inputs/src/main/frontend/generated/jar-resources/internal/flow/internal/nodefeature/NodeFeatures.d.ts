/**
 * Registry of node feature id numbers and map keys shared between server and
 * client.
 *
 * For internal use only. May be renamed or removed in a future release.
 *
 * TypeScript port of com.vaadin.flow.internal.nodefeature.NodeFeatures.
 *
 * Each id's Javadoc below references the server-side feature class it identifies
 * (e.g. `ElementData`). Those classes live in `com.vaadin.flow.internal.nodefeature`,
 * outside this port's scope, so the references stay code spans permanently.
 */
export declare const NodeFeatures: {
    /**
     * Id for `ElementData`.
     */
    readonly ELEMENT_DATA: 0;
    /**
     * Id for `ElementPropertyMap`.
     */
    readonly ELEMENT_PROPERTIES: 1;
    /**
     * Id for `ElementChildrenList`.
     */
    readonly ELEMENT_CHILDREN: 2;
    /**
     * Id for `ElementAttributeMap`.
     */
    readonly ELEMENT_ATTRIBUTES: 3;
    /**
     * Id for `ElementListenerMap`.
     */
    readonly ELEMENT_LISTENERS: 4;
    /**
     * Id for `PushConfigurationMap`.
     */
    readonly UI_PUSHCONFIGURATION: 5;
    /**
     * Id for `PushConfigurationParametersMap`.
     */
    readonly UI_PUSHCONFIGURATION_PARAMETERS: 6;
    /**
     * Id for `TextNodeMap`.
     */
    readonly TEXT_NODE: 7;
    /**
     * Id for `PollConfigurationMap`.
     */
    readonly POLL_CONFIGURATION: 8;
    /**
     * Id for `ReconnectDialogConfigurationMap`.
     */
    readonly RECONNECT_DIALOG_CONFIGURATION: 9;
    /**
     * Id for `ReconnectDialogConfigurationMap`.
     */
    readonly LOADING_INDICATOR_CONFIGURATION: 10;
    /**
     * Id for `ElementClassList`.
     */
    readonly CLASS_LIST: 11;
    /**
     * Id for `ElementStylePropertyMap`.
     */
    readonly ELEMENT_STYLE_PROPERTIES: 12;
    /**
     * Id for `ComponentMapping`.
     */
    readonly COMPONENT_MAPPING: 15;
    /**
     * Id for `ModelList`.
     */
    readonly TEMPLATE_MODELLIST: 16;
    /**
     * Id for `PolymerServerEventHandlers`.
     */
    readonly POLYMER_SERVER_EVENT_HANDLERS: 17;
    /**
     * Id for `PolymerEventListenerMap`.
     */
    readonly POLYMER_EVENT_LISTENERS: 18;
    /**
     * Id for `ClientCallableHandlers`.
     */
    readonly CLIENT_DELEGATE_HANDLERS: 19;
    /**
     * Id for `ShadowRootData`.
     */
    readonly SHADOW_ROOT_DATA: 20;
    /**
     * Id for `ShadowRootHost`.
     */
    readonly SHADOW_ROOT_HOST: 21;
    /**
     * Id for `AttachExistingElementFeature`.
     */
    readonly ATTACH_EXISTING_ELEMENT: 22;
    /**
     * Id for `BasicTypeValue`.
     */
    readonly BASIC_TYPE_VALUE: 23;
    /**
     * Id for `VirtualChildrenList`.
     */
    readonly VIRTUAL_CHILDREN: 24;
    /**
     * Id for `ReturnChannelMap`.
     */
    readonly RETURN_CHANNEL_MAP: 25;
    /**
     * Id for `InertData`.
     */
    readonly INERT_DATA: 26;
    /**
     * Id for `SignalBindingFeature`.
     */
    readonly SIGNAL_BINDING: 27;
};
