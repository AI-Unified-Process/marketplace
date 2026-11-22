/**
 * A utility class providing constants for JSON related features.
 *
 * TypeScript port of com.vaadin.flow.shared.JsonConstants; a subset containing
 * only the constants the ported communication layer needs so far. Missing
 * entries are added as later ports require them.
 */
export declare const JsonConstants: {
    /**
     * Key holding id of the node affected by a change.
     */
    readonly CHANGE_NODE: "node";
    /**
     * Key holding the type of a change.
     */
    readonly CHANGE_TYPE: "type";
    /**
     * Change type for empty change (populate the feature on the client side
     * only).
     */
    readonly CHANGE_TYPE_NOOP: "empty";
    /**
     * Change type for attaching nodes.
     */
    readonly CHANGE_TYPE_ATTACH: "attach";
    /**
     * Change type for detaching nodes.
     */
    readonly CHANGE_TYPE_DETACH: "detach";
    /**
     * Change type for list splice changes.
     */
    readonly CHANGE_TYPE_SPLICE: "splice";
    /**
     * Change type for map put changes.
     */
    readonly CHANGE_TYPE_PUT: "put";
    /**
     * Change type for map remove changes.
     */
    readonly CHANGE_TYPE_REMOVE: "remove";
    /**
     * Change type for list clear changes.
     */
    readonly CHANGE_TYPE_CLEAR: "clear";
    /**
     * Key holding the feature of a change.
     */
    readonly CHANGE_FEATURE: "feat";
    /**
     * Key holding the feature type.
     */
    readonly CHANGE_FEATURE_TYPE: "featType";
    /**
     * Key holding the map key of the change.
     */
    readonly CHANGE_MAP_KEY: "key";
    /**
     * Key holding nodes to add for a splice.
     */
    readonly CHANGE_SPLICE_ADD_NODES: "addNodes";
    /**
     * Key holding values to add for a splice.
     */
    readonly CHANGE_SPLICE_ADD: "add";
    /**
     * Key holding the number of items to remove for a splice.
     */
    readonly CHANGE_SPLICE_REMOVE: "remove";
    /**
     * Key holding the index of a splice.
     */
    readonly CHANGE_SPLICE_INDEX: "index";
    /**
     * Key holding the value of a put change.
     */
    readonly CHANGE_PUT_VALUE: "value";
    /**
     * Key holder the node value of a put change.
     */
    readonly CHANGE_PUT_NODE_VALUE: "nodeValue";
    /**
     * Key holding the type in of messages sent from the client.
     */
    readonly RPC_TYPE: "type";
    /**
     * Type value for events sent from the client.
     */
    readonly RPC_TYPE_EVENT: "event";
    /**
     * Type value for navigation events from the client.
     */
    readonly RPC_TYPE_NAVIGATION: "navigation";
    /**
     * Key holding the node in messages sent from the client.
     */
    readonly RPC_NODE: "node";
    /**
     * Key holding the event type in event messages sent from the client.
     */
    readonly RPC_EVENT_TYPE: "event";
    /**
     * Type value for model map synchronizations sent from the client.
     */
    readonly RPC_TYPE_MAP_SYNC: "mSync";
    /**
     * Key holding the event data in event messages sent from the client.
     */
    readonly RPC_EVENT_DATA: "data";
    /**
     * Key used to hold the feature id when synchronizing node values.
     */
    readonly RPC_FEATURE: "feature";
    /**
     * Key used to hold the name of the synchronized property.
     */
    readonly RPC_PROPERTY: "property";
    /**
     * Key used to hold the value of the synchronized property.
     */
    readonly RPC_PROPERTY_VALUE: "value";
    /**
     * Key used to hold the location in a navigation message.
     */
    readonly RPC_NAVIGATION_LOCATION: "location";
    /**
     * Key used to hold the state in a navigation message.
     */
    readonly RPC_NAVIGATION_STATE: "state";
    /**
     * Key used in navigation messages triggered by a router link.
     */
    readonly RPC_NAVIGATION_ROUTERLINK: "link";
    /**
     * Type value for events sent from the client to an event handler published on
     * the server.
     */
    readonly RPC_PUBLISHED_SERVER_EVENT_HANDLER: "publishedEventHandler";
    /**
     * Key used to hold the server side method name in template event messages
     * sent from the client.
     */
    readonly RPC_TEMPLATE_EVENT_METHOD_NAME: "templateEventMethodName";
    /**
     * Key used to hold the argument values for server side method call.
     *
     * @see {@link RPC_TEMPLATE_EVENT_METHOD_NAME}
     * @see {@link RPC_PUBLISHED_SERVER_EVENT_HANDLER}
     */
    readonly RPC_TEMPLATE_EVENT_ARGS: "templateEventMethodArgs";
    /**
     * Key used to hold the promise id for a server side method call.
     */
    readonly RPC_TEMPLATE_EVENT_PROMISE: "promise";
    /**
     * Name of the $server property that is used to track pending promises. The
     * name is chosen to avoid conflicts with genuine $server method names.
     */
    readonly RPC_PROMISE_CALLBACK_NAME: "}p";
    /**
     * Type value for attach existing element server callback.
     *
     * @see {@link RPC_ATTACH_ASSIGNED_ID}
     * @see {@link RPC_ATTACH_REQUESTED_ID}
     * @see {@link RPC_ATTACH_TAG_NAME}
     * @see {@link RPC_ATTACH_INDEX}
     */
    readonly RPC_ATTACH_EXISTING_ELEMENT: "attachExistingElement";
    /**
     * Type value for attach existing element server callback.
     *
     * @see {@link RPC_ATTACH_ASSIGNED_ID}
     * @see {@link RPC_ATTACH_REQUESTED_ID}
     * @see {@link RPC_ATTACH_TAG_NAME}
     * @see {@link RPC_ATTACH_ID}
     */
    readonly RPC_ATTACH_EXISTING_ELEMENT_BY_ID: "attachExistingElementById";
    /**
     * Key used to hold requested state node identifier for attach existing element
     * request.
     */
    readonly RPC_ATTACH_REQUESTED_ID: "attachReqId";
    /**
     * Key used to hold assigned state node identifier for attach existing element
     * request.
     */
    readonly RPC_ATTACH_ASSIGNED_ID: "attachAssignedId";
    /**
     * Key used to hold tag name for attach existing element request.
     */
    readonly RPC_ATTACH_TAG_NAME: "attachTagName";
    /**
     * Key used to hold index of server side element for attach existing element
     * request.
     */
    readonly RPC_ATTACH_INDEX: "attachIndex";
    /**
     * Key used to hold id of the element for attach existing element request.
     */
    readonly RPC_ATTACH_ID: "attachId";
    /**
     * Key holding the debounce phase for an event data map from the client.
     */
    readonly EVENT_DATA_PHASE: "for";
    /**
     * Character used for representing `DebouncePhase.LEADING`.
     */
    readonly EVENT_PHASE_LEADING: "leading";
    /**
     * Character used for representing `DebouncePhase.INTERMEDIATE`.
     */
    readonly EVENT_PHASE_INTERMEDIATE: "intermediate";
    /**
     * Character used for representing `DebouncePhase.TRAILING`.
     */
    readonly EVENT_PHASE_TRAILING: "trailing";
    /**
     * Token used as an event data expression to represent that properties
     * should be synchronized. The token is chosen to avoid collisions with
     * regular event data expressions by using a character that cannot be the
     * start of a valid JS expression.
     */
    readonly SYNCHRONIZE_PROPERTY_TOKEN: "}";
    /**
     * Token used as an event data expression or prefix to an event data
     * expression to represent that the state node ID should be fetched for the
     * element, or its closest parent, that corresponds to `event.target` or the
     * element returned by the evaluated expression.
     *
     * The token is chosen to avoid collisions with regular event data
     * expressions by using a character that cannot be the start of a valid JS
     * expression.
     */
    readonly MAP_STATE_NODE_EVENT_DATA: "]";
    /**
     * RPC type value used for return channel messages.
     */
    readonly RPC_TYPE_CHANNEL: "channel";
    /**
     * Key for the channel id in return channel messages.
     */
    readonly RPC_CHANNEL: "channel";
    /**
     * Key for the arguments array in return channel messages.
     */
    readonly RPC_CHANNEL_ARGUMENTS: "args";
};
