/**
 * A timer that can be scheduled once or repeatedly, and cancelled: `schedule` is
 * one-shot, `scheduleRepeating` is an interval, `cancel` stops either.
 */
export declare class Timer {
    #private;
    constructor(task: () => void);
    schedule(ms: number): void;
    scheduleRepeating(ms: number): void;
    cancel(): void;
}
