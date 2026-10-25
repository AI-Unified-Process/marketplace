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
import { Console } from './Console';
/** Tracks loaded resources and their listeners; the dedup/fanout kernel of ResourceLoader. */
export class ResourceRegistry {
    #loadedResources = new Set();
    #loadListeners = new Map();
    // Maps a dependency id to its resource key (URL/content) for removal.
    #dependencyIdToResourceKey = new Map();
    #registry;
    constructor(registry) {
        this.#registry = registry;
    }
    /** Whether the resource identified by the given key has finished loading. */
    isLoaded(key) {
        return this.#loadedResources.has(key);
    }
    /** Marks a resource key as already loaded (e.g. discovered in the DOM). */
    markLoaded(key) {
        this.#loadedResources.add(key);
    }
    /** Associates a dependency id with its resource key, for later removal. */
    registerDependencyId(dependencyId, resourceKey) {
        this.#dependencyIdToResourceKey.set(dependencyId, resourceKey);
    }
    /**
     * Registers a load listener for a resource key, returning true if it is the
     * first listener (i.e. the caller should start loading the resource). Mirrors
     * ResourceLoader.addListener.
     */
    addListener(resourceId, listener) {
        const listeners = this.#loadListeners.get(resourceId);
        if (listeners === undefined) {
            this.#loadListeners.set(resourceId, [listener]);
            return true;
        }
        listeners.push(listener);
        return false;
    }
    /** Marks the resource loaded and notifies (then clears) its listeners. Mirrors fireLoad. */
    fireLoad(event) {
        Console.debug(`Loaded ${event.getResourceData()}`);
        const resource = event.getResourceData();
        const listeners = this.#loadListeners.get(resource);
        this.#loadedResources.add(resource);
        this.#loadListeners.delete(resource);
        listeners?.forEach((listener) => listener?.onLoad(event));
    }
    /** Reports the error and notifies (then clears) the resource's listeners. Mirrors fireError. */
    fireError(event) {
        // Java resolves the handler through the registry at each failure, so a
        // registry reset is picked up rather than bound at construction.
        this.#registry.getSystemErrorHandler().handleError(`Error loading ${event.getResourceData()}`);
        const resource = event.getResourceData();
        const listeners = this.#loadListeners.get(resource);
        this.#loadListeners.delete(resource);
        listeners?.forEach((listener) => listener?.onError(event));
    }
    /** Clears a resource (loaded flag + listeners + mapping) by its dependency id. */
    clearLoadedResourceById(dependencyId) {
        const resourceKey = this.#dependencyIdToResourceKey.get(dependencyId);
        if (resourceKey !== undefined) {
            this.#loadedResources.delete(resourceKey);
            this.#loadListeners.delete(resourceKey);
            this.#dependencyIdToResourceKey.delete(dependencyId);
        }
    }
}
//# sourceMappingURL=ResourceRegistry.js.map