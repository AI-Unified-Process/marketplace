import type { Computation } from './Computation';
/**
 * Event fired when a computation is invalidated.
 */
export declare class InvalidateEvent {
    #private;
    /**
     * Creates a new event for computation.
     *
     * @param source - the invalidated computation
     */
    constructor(source: Computation);
    /**
     * Gets the invalidated computation.
     *
     * @returns the invalidated computation
     */
    getSource(): Computation;
}
