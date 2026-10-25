import type { StateNode } from '../StateNode';
import type { BinderContext } from './BinderContext';
import type { BindingStrategy } from './BindingStrategy';
/** Binding strategy for simple (not template) text `Node`. */
export declare class TextBindingStrategy implements BindingStrategy<Text> {
    #private;
    create(_node: StateNode): Text;
    isApplicable(node: StateNode): boolean;
    bind(stateNode: StateNode, htmlNode: Text, _nodeFactory: BinderContext): void;
    /**
     * Gets the tag value from the {@link NodeFeatures.ELEMENT_DATA} feature for
     * the `node`.
     *
     * @param node - the state node
     * @returns tag of the `node`
     */
    getTag(node: StateNode): string | null;
}
