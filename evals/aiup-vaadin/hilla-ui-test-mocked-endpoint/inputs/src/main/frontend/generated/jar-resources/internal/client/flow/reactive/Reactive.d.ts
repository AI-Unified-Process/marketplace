import type { Command } from '../../Command';
import type { EventRemover } from '../../../EventRemover';
import { Computation } from './Computation';
import type { FlushListener } from './FlushListener';
import type { ReactiveValueChangeEvent } from './ReactiveValueChangeEvent';
import type { ReactiveValueChangeListener } from './ReactiveValueChangeListener';
/**
 * Handles global features related to reactivity, such as keeping track of the
 * current {@link Computation}, providing a lazy flush cycle and registering
 * reactive event collectors, over the {@link ReactiveValue} instances a
 * computation reads.
 *
 * With a reactive programming model, the dependencies needed for producing a
 * result are automatically registered when the result is computed. When any
 * dependency of a computation is changed, that computation is scheduled to be
 * recomputed. To reduce the number of recomputations performed when many
 * dependencies are updated, the recomputation is performed lazily the next time
 * {@link flush} is invoked.
 *
 * @see {@link Computation}
 */
export declare const Reactive: {
    /**
     * Adds a listener that will be invoked the next time {@link flush} is
     * invoked. A listener added during a flush will be invoked before that
     * flush finishes.
     *
     * @param flushListener - the flush listener to add
     */
    addFlushListener(flushListener: FlushListener): void;
    /**
     * Adds a listener that will be invoked during the next {@link flush},
     * after all regular flush listeners have been invoked. If a post flush
     * listener adds new flush listeners, those flush listeners will be invoked
     * before the next post flush listener is invoked.
     *
     * @param postFlushListener - the listener to add
     */
    addPostFlushListener(postFlushListener: FlushListener): void;
    /**
     * Flushes all flush listeners and post flush listeners. A listener is
     * discarded after it has been invoked once. This means that there will be
     * no listeners registered for the next flush at the time this method
     * returns.
     *
     * @see {@link addFlushListener}
     * @see {@link addPostFlushListener}
     */
    flush(): void;
    /**
     * Gets the currently active computation. Any reactive value that is
     * accessed when a computation is active should be added as a dependency to
     * that computation so that the computation will be invalidated if the value
     * changes.
     *
     * @returns the current computation, or `null` if there is no current
     *   computation.
     */
    getCurrentComputation(): Computation | null;
    /**
     * Runs a task with the given computation set as
     * {@link getCurrentComputation}. If another computation is set as the
     * current computation, it is temporarily replaced by the provided
     * computation, but restored again after the provided task has been run.
     *
     * @param computation - the computation to set as current
     * @param command - the command to run while the computation is set as current
     */
    runWithComputation(computation: Computation | null, command: Command): void;
    /**
     * Adds a reactive change listener that will be invoked whenever a reactive
     * change event is fired from any reactive event router.
     *
     * @param reactiveValueChangeListener - the listener to add
     * @returns an event remover that can be used to remove the listener
     */
    addEventCollector(reactiveValueChangeListener: ReactiveValueChangeListener): EventRemover;
    /**
     * Fires a reactive change event to all registered event collectors.
     *
     * @see {@link addEventCollector}
     *
     * @param event - the fired event
     */
    notifyEventCollectors(event: ReactiveValueChangeEvent): void;
    /**
     * Evaluates the given command whenever there is a change in any
     * {@link ReactiveValue} used in the command.
     *
     * @param command - the command to run
     * @returns A {@link Computation} object which can be used to control the
     *   evaluation
     */
    runWhenDependenciesChange(command: Command): Computation;
    /**
     * Resets Reactive to the initial state.
     *
     * Intended for test cases to call in setup to avoid having tests affect
     * each other as Reactive state is static and shared.
     *
     * Should never be called from non-test code!
     */
    reset(): void;
};
