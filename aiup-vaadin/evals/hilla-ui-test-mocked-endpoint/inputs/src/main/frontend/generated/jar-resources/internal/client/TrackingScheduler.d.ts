import type { Command } from './Command';
/**
 * Scheduler implementation which tracks and reports whether there is any work
 * queued or currently being executed.
 */
export declare class TrackingScheduler {
    #private;
    /** Schedules a command to run deferred, tracking it as pending until it has run. */
    scheduleDeferred(command: Command): void;
    /**
     * Checks if there is work queued or currently being executed.
     *
     * @returns true if there is work queued or if work is currently being
     *          executed, false otherwise
     */
    hasWorkQueued(): boolean;
}
/** The shared TrackingScheduler; mirrors GWT's Scheduler.get(). */
export declare function getScheduler(): TrackingScheduler;
