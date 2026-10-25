import type { StateNode } from '../StateNode';
import type { BinderContext } from './BinderContext';
/**
 * Binding strategy/factory for {@link StateNode}s.
 *
 * Only one strategy may be applicable for the given {@link StateNode} instance.
 * Once the applicable strategy is identified it's used to produce a `Node` based
 * on the {@link StateNode} instance and bind it.
 *
 * @typeParam T - a DOM node type which strategy is applicable for
 */
export interface BindingStrategy<T extends Node> {
    /**
     * Creates a DOM node for the `node`.
     *
     * @param node - the state node for which to create a DOM node, not `null`
     * @returns the DOM node, not `null`
     */
    create(node: StateNode): T;
    /**
     * Returns `true` is the strategy is applicable to the `node`.
     *
     * @param node - the state node to check against of
     * @returns `true` if the strategy is applicable to the node
     */
    isApplicable(node: StateNode): boolean;
    /**
     * Binds a DOM node to the `stateNode` using `context` to create and bind
     * nodes of other types.
     *
     * @param stateNode - the state node to bind, not `null`
     * @param domNode - the DOM node, not `null`
     * @param context - binder context to create and construct HTML nodes of other
     *            types
     */
    bind(stateNode: StateNode, domNode: T, context: BinderContext): void;
    /**
     * Gets the tag value from the {@link NodeFeatures.ELEMENT_DATA} feature for
     * the `node`.
     *
     * @param node - the state node
     * @returns tag of the `node`
     */
    getTag(node: StateNode): string | null;
}
