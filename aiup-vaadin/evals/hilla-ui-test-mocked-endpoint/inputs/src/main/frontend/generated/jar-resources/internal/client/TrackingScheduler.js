/*
 * Copyright 2000-2026 Vaadin Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */
/**
 * Scheduler implementation which tracks and reports whether there is any work
 * queued or currently being executed.
 */
export class TrackingScheduler {
    // 0 == no deferred commands in progress, > 0 otherwise.
    #deferredCommandTrackers = 0;
    /** Schedules a command to run deferred, tracking it as pending until it has run. */
    scheduleDeferred(command) {
        this.#deferredCommandTrackers++;
        setTimeout(command, 0);
        setTimeout(() => {
            this.#deferredCommandTrackers--;
        }, 0);
    }
    /**
     * Checks if there is work queued or currently being executed.
     *
     * @returns true if there is work queued or if work is currently being
     *          executed, false otherwise
     */
    hasWorkQueued() {
        return this.#deferredCommandTrackers !== 0;
    }
}
// The shared instance, mirroring GWT's global Scheduler.get() (which Flow
// replaces with a TrackingScheduler). Deferred work scheduling (e.g.
// ServerRpcQueue.flush) and the idle check (ApplicationConnection.isActive) must
// use this SAME instance, so a pending deferred send keeps isActive true and
// TestBench's waitForVaadin waits for the round-trip instead of asserting early.
let sharedScheduler = null;
/** The shared TrackingScheduler; mirrors GWT's Scheduler.get(). */
export function getScheduler() {
    if (sharedScheduler === null) {
        sharedScheduler = new TrackingScheduler();
    }
    return sharedScheduler;
}
//# sourceMappingURL=TrackingScheduler.js.map