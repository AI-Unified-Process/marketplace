import type { Registry } from './Registry';
import type { MapProperty } from './flow/nodefeature/MapProperty';
import type { StateNode } from './flow/StateNode';
/**
 * Handles server initial property values so client-side defaults don't override
 * them; mirrors InitialPropertiesHandler.java.
 */
export declare class InitialPropertiesHandler {
    #private;
    /**
     * Creates a new instance connected to the given registry.
     *
     * @param registry - the global registry
     */
    constructor(registry: Registry);
    /**
     * Flushes the collected property update queue. Supposed to be called at the
     * end of tree change processing.
     */
    flushPropertyUpdates(): void;
    /**
     * Notifies the handler about registered node.
     *
     * The method is called for the newly created `node` which is registered in
     * the {@link StateTree}.
     *
     * @param node - the newly registered node
     */
    nodeRegistered(node: StateNode): void;
    /**
     * Handles the property update before it's sent to the server via RPC.
     *
     * The method returns `true` for the `property` which shouldn't be sent to
     * the server because it's going to be handled by the handler (queued and sent
     * later on if allowed).
     *
     * @param property - property to handle
     * @returns `true` if property is handled by the handler, `false` otherwise
     */
    handlePropertyUpdate(property: MapProperty): boolean;
}
