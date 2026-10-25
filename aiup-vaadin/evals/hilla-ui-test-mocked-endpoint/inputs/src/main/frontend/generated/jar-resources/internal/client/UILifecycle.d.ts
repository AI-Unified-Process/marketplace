import type { EventRemover } from '../EventRemover';
/** The lifecycle state of a UI; the order defines the allowed forward transitions. */
export declare const UIState: {
    readonly INITIALIZING: "INITIALIZING";
    readonly RUNNING: "RUNNING";
    readonly TERMINATED: "TERMINATED";
};
export type UIState = (typeof UIState)[keyof typeof UIState];
/**
 * Manages the lifecycle of a UI.
 */
export declare class UILifecycle {
    #private;
    /**
     * Gets the state of the UI.
     *
     * @returns the current state of the UI
     */
    getState(): UIState;
    /**
     * Sets the state of the UI to the given value.
     *
     * Only allows state changes in one direction: {@link UIState.INITIALIZING}
     * -\> {@link UIState.RUNNING} -\> {@link UIState.TERMINATED}.
     *
     * Changing the state fires a {@link StateChangeEvent}.
     *
     * @param state - the new UI state
     */
    setState(state: UIState): void;
    /**
     * Check if the state is {@link UIState.RUNNING}.
     *
     * @returns `true` if the status is {@link UIState.RUNNING}, `false`
     *          otherwise
     */
    isRunning(): boolean;
    /**
     * Check if the state is {@link UIState.TERMINATED}.
     *
     * @returns `true` if the status is {@link UIState.TERMINATED}, `false`
     *          otherwise
     */
    isTerminated(): boolean;
    /**
     * Adds a state change event handler.
     *
     * @param handler - the handler to add
     * @returns a handler registration object which can be used to remove the
     *          handler
     */
    addHandler(handler: StateChangeHandler): EventRemover;
}
/**
 * Event triggered when the lifecycle state of a UI is changed.
 *
 * To listen for the event add a {@link StateChangeHandler} using
 * {@link UILifecycle.addHandler}.
 */
export interface StateChangeEvent {
    /**
     * Gets the {@link UILifecycle} instance which triggered this event.
     *
     * @returns the {@link UILifecycle} which triggered the event
     */
    getUiLifecycle(): UILifecycle;
}
/** A listener for UI lifecycle state changes; mirrors StateChangeHandler. */
export type StateChangeHandler = (event: StateChangeEvent) => void;
