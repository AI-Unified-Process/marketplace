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
import { Console } from '../Console';
// com.vaadin.flow.shared.ApplicationConstants
const SERVER_SYNC_ID = 'syncId';
const RESYNCHRONIZE_ID = 'resynchronize';
// The value of an undefined sync id (must be -1 per getLastSeenServerSyncId).
export const UNDEFINED_SYNC_ID = -1;
/** The server id of a message, or -1 if it has none. Mirrors getServerId. */
export function getServerId(json) {
    return SERVER_SYNC_ID in json ? json[SERVER_SYNC_ID] : -1;
}
/** Whether a message is a resynchronization response. Mirrors isResynchronize. */
export function isResynchronize(json) {
    return RESYNCHRONIZE_ID in json;
}
/** Data structure holding information about pending UIDL messages. */
class PendingUIDLMessage {
    #json;
    /**
     * Creates a new instance based on the given JSON.
     *
     * @param json - the JSON to wrap
     */
    constructor(json) {
        this.#json = json;
    }
    /**
     * The wrapped JSON.
     *
     * @returns the JSON this message was created from
     */
    getJson() {
        return this.#json;
    }
}
/**
 * Tracks the last seen server sync id and the queue of pending (out-of-order or
 * locked) UIDL messages, deciding which to handle next. Mirrors the ordering
 * state of MessageHandler.
 */
export class PendingMessageQueue {
    #lastSeenServerSyncId = UNDEFINED_SYNC_ID;
    #pending = [];
    /** The last seen server sync id; -1 before any response has been processed. */
    getLastSeenServerSyncId() {
        return this.#lastSeenServerSyncId;
    }
    setLastSeenServerSyncId(serverId) {
        this.#lastSeenServerSyncId = serverId;
    }
    /** The server id the client is currently waiting for. */
    getExpectedServerId() {
        return this.#lastSeenServerSyncId + 1;
    }
    /** Whether the given server id is the one currently expected (or always-ok). */
    isNextExpectedMessage(serverId) {
        if (serverId === -1) {
            return true;
        }
        if (serverId === this.getExpectedServerId()) {
            return true;
        }
        // The first message is always ok.
        return this.#lastSeenServerSyncId === UNDEFINED_SYNC_ID;
    }
    /** Whether the given server id has already been seen (a stale re-send). */
    isAlreadySeen(serverId) {
        return serverId <= this.#lastSeenServerSyncId;
    }
    push(json) {
        this.#pending.push(new PendingUIDLMessage(json));
    }
    isEmpty() {
        return this.#pending.length === 0;
    }
    length() {
        return this.#pending.length;
    }
    clear() {
        this.#pending = [];
    }
    /** The index of the next pending message that can be handled now, or -1. */
    findNextHandlable() {
        for (let i = 0; i < this.#pending.length; i++) {
            if (this.isNextExpectedMessage(getServerId(this.#pending[i].getJson()))) {
                return i;
            }
        }
        return -1;
    }
    /** Removes and returns the pending message at the given index. */
    remove(index) {
        return this.#pending.splice(index, 1)[0].getJson();
    }
    /** Drops pending messages whose server id is older than the expected one. */
    removeOld() {
        for (let i = 0; i < this.#pending.length; i++) {
            const serverId = getServerId(this.#pending[i].getJson());
            if (serverId !== -1 && serverId < this.getExpectedServerId()) {
                Console.debug(`Removing old message with id ${serverId}`);
                this.#pending.splice(i, 1);
                i--;
            }
        }
    }
}
//# sourceMappingURL=MessageOrdering.js.map