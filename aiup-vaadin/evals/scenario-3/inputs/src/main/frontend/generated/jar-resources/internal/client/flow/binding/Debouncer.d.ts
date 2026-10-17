type SendCommand = (phase: string) => void;
type Command = () => void;
/**
 * Manages debouncing of events. Use {@link Debouncer.getOrCreate} to either
 * create a new instance or get an existing instance that currently tracks a
 * sequence of similar events.
 */
export declare class Debouncer {
    #private;
    private constructor();
    /**
     * Informs this debouncer that an event has occurred.
     *
     * @param phases - a set of strings identifying the phases for which the
     *            triggered event should be considered.
     * @param command - a consumer that will may be asynchronously invoked with a
     *            phase code if an associated phase is triggered
     * @param commands - individual commands executed just before the given send
     *            command
     *
     * @returns `true` if the event should be processed as-is without
     *         delaying
     */
    trigger(phases: Set<string>, command: SendCommand, commands: Map<string, Command>): boolean;
    /**
     * Gets an existing debouncer or creates a new one associated with the given
     * DOM node, identifier and debounce timeout.
     *
     * @param element - the DOM node to which this debouncer is bound
     * @param identifier - a unique identifier string in the scope of the provided
     *            element
     * @param debounce - the debounce timeout
     * @returns a debouncer instance
     */
    static getOrCreate(element: Node, identifier: string, debounce: number): Debouncer;
    /**
     * Flushes all pending changes.
     *
     * After command execution, Debouncer idle timers are rescheduled.
     *
     * @returns the list command executed during flush operation.
     */
    static flushAll(): SendCommand[];
}
export {};
