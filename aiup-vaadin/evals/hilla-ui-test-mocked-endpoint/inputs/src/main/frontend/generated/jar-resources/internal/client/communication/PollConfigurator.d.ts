import type { StateNode } from '../flow/StateNode';
import type { Poller } from './Poller';
/**
 * Observes the poll configuration stored in the given node and configures polling
 * accordingly.
 *
 * @param node - the node containing the poll configuration
 * @param poller - the poller to configure
 */
export declare function observe(node: StateNode, poller: Poller): void;
