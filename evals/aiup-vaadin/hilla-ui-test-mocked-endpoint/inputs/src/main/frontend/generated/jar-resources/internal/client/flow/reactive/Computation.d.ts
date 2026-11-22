import type { InvalidateListener } from './InvalidateListener';
import type { ReactiveValue } from './ReactiveValue';
import type { ReactiveValueChangeEvent } from './ReactiveValueChangeEvent';
/**
 * Automatically reruns the recompute command whenever any reactive value used
 * by it changes. The recompute command is invoked by the next invocation of
 * {@link Reactive.flush}, unless it has been invoked manually before the global
 * flush. A computation is also scheduled to for an initial "recomputation" when
 * it is created.
 *
 * Mirrors Computation.java in its decoupled, callback form.
 */
export declare class Computation {
    #private;
    /**
     * Creates a new computation.
     *
     * @param recomputeCommand - the command that does the actual recomputation.
     *   This command is run in a way that automatically registers dependencies
     *   to any reactive value accessed.
     */
    constructor(recomputeCommand: () => void);
    /**
     * Adds a dependency to a reactive value. This computation is scheduled for
     * recomputation when any dependency fires a change event. All previous
     * dependencies are cleared before recomputing.
     *
     * This method is automatically called when a reactive value is used for
     * recomputing this computation. The developer is not expected to call this
     * method himself.
     *
     * @param dependency - the reactive value to depend on
     */
    addDependency(dependency: ReactiveValue): void;
    /**
     * Invoked when a reactive value has changed.
     *
     * @param _changeEvent - the change event
     */
    onValueChange(_changeEvent: ReactiveValueChangeEvent): void;
    /**
     * Stops this computation, so that it will no longer be recomputed.
     */
    stop(): void;
    /**
     * Checks whether this computation is invalidated. An invalidated
     * computation will eventually be recomputed (unless it has also been
     * stopped). Recomputation will happen the next time {@link recompute} or
     * {@link Reactive.flush} is invoked.
     *
     * @returns `true` if this computation is invalidated; otherwise `false`
     */
    isInvalidated(): boolean;
    /**
     * Recomputes this computation.
     */
    recompute(): void;
    /**
     * Adds an invalidate listener that will be invoked the next time this
     * computation is invalidated.
     *
     * @param listener - the listener to run on the next invalidation
     */
    onNextInvalidate(listener: InvalidateListener): void;
}
