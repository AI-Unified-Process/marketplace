import type { Registry } from '../Registry';
/**
 * Manages the state of loading indicator based on active RPC requests, event
 * types, and lifecycle events. This class ensures appropriate visual feedback
 * (e.g., loading bar) is shown or hidden according to the current network
 * conditions and request status. It is responsible for muting the loading
 * indication when RPC requests are triggered by high-frequency UI events
 * (mousemove and such) to avoid excessive visual noise in these cases.
 */
export declare class LoadingIndicatorStateHandler {
    #private;
    /**
     * Creates a new instance connected to the given registry.
     *
     * @param registry - the global registry
     */
    constructor(registry: Registry);
    /** Shows loading when a non-silent request starts. */
    startLoading(): void;
    /** Hides loading when no requests remain active (debounced). */
    stopLoading(): void;
    /**
     * Processes an RPC message to determine if a loading indicator should be displayed.
     *
     * @param rpcType - the type of RPC request being processed
     * @param eventType - for event RPC requests, the name of the event, otherwise
     *          `null`
     */
    processMessage(rpcType: string | null, eventType: string | null): void;
}
