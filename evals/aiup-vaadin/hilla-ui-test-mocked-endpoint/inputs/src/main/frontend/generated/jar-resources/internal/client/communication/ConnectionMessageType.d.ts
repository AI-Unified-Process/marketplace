export declare const ConnectionMessageType: {
    readonly HEARTBEAT: "HEARTBEAT";
    readonly PUSH: "PUSH";
    readonly XHR: "XHR";
};
export type ConnectionMessageType = (typeof ConnectionMessageType)[keyof typeof ConnectionMessageType];
/** Whether the type represents a message transport (push or XHR), not a heartbeat. */
export declare function isMessage(type: ConnectionMessageType): boolean;
/**
 * Checks if the first type is of higher priority than the given type.
 *
 * @param type - the type to compare from
 * @param other - the type to compare to
 * @returns true if the first type has higher priority than the given type, false
 *          otherwise
 */
export declare function isHigherPriorityThan(type: ConnectionMessageType, other: ConnectionMessageType): boolean;
