import { StateNode } from './StateNode';
import type { StateTree } from './StateTree';
type Change = Record<string, unknown>;
/**
 * Update a state tree based on a JSON array of changes.
 *
 * @param tree - the tree to update
 * @param changes - the JSON array of changes
 * @returns a set of updated nodes addressed by the `changes`
 */
export declare function processChanges(tree: StateTree, changes: Change[]): Set<StateNode>;
/**
 * Update a state tree based on a JSON change. This method is public for testing
 * purposes.
 *
 * @param tree - the tree to update
 * @param change - the JSON change
 * @returns the updated node addressed by the provided `change`
 */
export declare function processChange(tree: StateTree, change: Change): StateNode | null;
export {};
