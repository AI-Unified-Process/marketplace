/**
 * Enables or disables profiling data gathering. Replaces the GWT deferred
 * binding on the `vaadin.profiler` property (Profiler.EnabledProfiler); the
 * engine bootstrap calls this to select the profiling build at runtime. There
 * is no compile-time equivalent in the TypeScript engine.
 */
export declare function setEnabled(enabled: boolean): void;
/**
 * Consumer that receives the profiler results, mirroring
 * Profiler.ProfilerResultConsumer.
 *
 * <b>Warning!</b> This interface is most likely to change in the future.
 */
export interface ProfilerResultConsumer {
    addProfilerData(rootNode: Node, totals: Node[]): void;
    addBootstrapData(timings: Map<string, number>): void;
}
/**
 * A hierarchical representation of the time spent running a named block of
 * code. Mirrors Profiler.Node.
 *
 * <b>Warning!</b> This class is most likely to change in the future.
 */
export declare class Node {
    #private;
    /**
     * Creates a new node with the given name.
     *
     * @param name - the name of the node
     */
    constructor(name: string | null);
    /**
     * Gets the name of the node.
     *
     * @returns the name of the node
     */
    getName(): string | null;
    /**
     * Creates a new child node or retrieves an existing child and updates its
     * total time and hit count.
     *
     * @param name - the name of the child
     * @param timestamp - the timestamp for when the node is entered
     * @returns the child node object
     */
    enterChild(name: string, timestamp: number): Node;
    /**
     * Gets the total time spent in this node, including sub nodes, in ms.
     *
     * @returns the total time spent, in milliseconds
     */
    getTimeSpent(): number;
    /**
     * Gets the minimum time spent for one invocation, including sub nodes, in ms.
     *
     * @returns the time spent for the fastest invocation, in milliseconds
     */
    getMinTimeSpent(): number;
    /**
     * Gets the maximum time spent for one invocation, including sub nodes, in ms.
     *
     * @returns the time spent for the slowest invocation, in milliseconds
     */
    getMaxTimeSpent(): number;
    /**
     * Gets the number of times this node has been entered.
     *
     * @returns the number of times the node has been entered
     */
    getCount(): number;
    /**
     * Gets the total time spent in this node, excluding sub nodes, in ms.
     *
     * @returns the total time spent, in milliseconds
     */
    getOwnTime(): number;
    /**
     * Gets the child nodes of this node.
     *
     * @returns a collection of child nodes
     */
    getChildren(): Node[];
    toString(): string;
    getStringRepresentation(prefix: string): string;
    sumUpTotals(totals: Map<string, Node>): void;
    /**
     * Marks the time spent in the child node.
     *
     * @param timestamp - the timestamp for when the node was left
     */
    leave(timestamp: number): void;
}
/**
 * Whether the profiling data gathering is enabled. Mirrors Profiler.isEnabled.
 *
 * @returns `true` if the profiling is enabled, else `false`
 */
export declare function isEnabled(): boolean;
/**
 * Enters a named block. There should always be a matching invocation of
 * {@link leave} when leaving the block.
 *
 * @param name - the name of the entered block
 */
export declare function enter(name: string): void;
/**
 * Leaves a named block. There should always be a matching invocation of
 * {@link enter} when entering the block.
 *
 * @param name - the name of the left block
 */
export declare function leave(name: string): void;
/**
 * Returns time relative to the particular page load time. The value should not
 * be used directly but rather the difference between two values returned by
 * this method should be used to compare measurements.
 *
 * @returns the relative time in milliseconds
 */
export declare function getRelativeTimeMillis(): number;
/** Resets the collected profiler data. No-op unless profiling is enabled. */
export declare function reset(): void;
/**
 * Initializes the profiler. This should be done before calling any other
 * function in this class. This method has no side effects if the initialization
 * has already been done.
 *
 * Should be called even if the profiler is not enabled, because it then removes
 * a logger function that might have been included in the HTML page and that
 * would otherwise leak memory.
 */
export declare function initialize(): void;
/** Outputs the gathered profiling data to the registered result consumer. */
export declare function logTimings(): void;
/**
 * Outputs the time passed since various events recorded in performance.timing
 * if supported by the browser.
 */
export declare function logBootstrapTimings(): void;
/**
 * Sets the profiler result consumer that is used to output the profiler data to
 * the user.
 *
 * <b>Warning!</b> This is internal API and should not be used by applications
 * or add-ons.
 *
 * @param profilerResultConsumer - the consumer that gets profiler data
 */
export declare function setProfilerResultConsumer(profilerResultConsumer: ProfilerResultConsumer): void;
/**
 * Returns a string containing the number of milliseconds which have elapsed
 * since the given reference time.
 *
 * @param reference - the reference time, as returned by {@link getRelativeTimeMillis}
 * @returns a string containing the number of ms elapsed since the reference time
 */
export declare function getRelativeTimeString(reference: number): string;
