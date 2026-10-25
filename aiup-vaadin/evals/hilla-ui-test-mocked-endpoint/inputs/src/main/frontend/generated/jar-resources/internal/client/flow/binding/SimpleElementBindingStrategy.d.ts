import { StateNode } from '../StateNode';
import type { BinderContext } from './BinderContext';
import type { BindingStrategy } from './BindingStrategy';
/**
 * Checks whether the `node` needs re-bind.
 *
 * The node needs re-bind if it was initially invisible. As a consequence such
 * node has not be bound. It has been bound in respect to visibility feature only
 * (partially bound). Such node needs re-bind once it becomes visible.
 *
 * @param node - the node to check
 * @returns `true` if the node is not entirely bound and needs re-bind later on
 */
export declare function needsRebind(node: StateNode): boolean;
/**
 * Binding strategy for a simple (not template) {@link Element} node.
 */
export declare class SimpleElementBindingStrategy implements BindingStrategy<Element> {
    create(node: StateNode): Element;
    isApplicable(node: StateNode): boolean;
    getTag(node: StateNode): string | null;
    bind(stateNode: StateNode, htmlNode: Element, nodeFactory: BinderContext): void;
}
