import type { Registry } from '../Registry';
import type { StateNode } from './StateNode';
/**
 * Processes the result of `Page.executeJs` on the client. `Page` is a
 * flow-server class, outside this port, so the reference stays a code span.
 */
export declare class ExecuteJavaScriptProcessor {
    #private;
    /**
     * Creates a new instance connected to the given registry.
     *
     * @param registry - the global registry
     */
    constructor(registry: Registry);
    /**
     * Executes invocations received from the server.
     *
     * @param invocations - a JSON containing invocation data
     */
    execute(invocations: unknown[][]): void;
    protected isBound(node: StateNode): boolean;
    /**
     * Executes the actual invocation.
     *
     * Protected instead of private for testing purposes, as in Java.
     *
     * @param parameterNamesAndCode - an array consisting of parameter names
     *          followed by the JavaScript expression to execute
     * @param parameters - an array of parameter values
     * @param nodeParameters - the node parameters
     */
    protected invoke(parameterNamesAndCode: string[], parameters: unknown[], nodeParameters: Map<unknown, StateNode>): void;
}
