import type { Registry } from './Registry';
import type { ResourceLoader } from './ResourceLoader';
/** Information about a (loaded or failed) resource; mirrors ResourceLoadEvent. */
export interface ResourceLoadEvent {
    /**
     * Gets the resource loader that has fired this event.
     *
     * @returns the resource loader
     */
    getResourceLoader(): ResourceLoader;
    /**
     * Gets the absolute url or content of the loaded resource or the JS expression
     * that imports the resource.
     *
     * @returns the absolute url or content of the loaded resource or the JS
     *          expression that imports the resource
     */
    getResourceData(): string;
}
/** Notified when a resource has loaded or failed; mirrors ResourceLoadListener. */
export interface ResourceLoadListener {
    /**
     * Notifies this ResourceLoadListener that a resource has been loaded. Some
     * browsers do not support any way of detecting load errors. In these cases,
     * onLoad will be called regardless of the status.
     *
     * @see {@link ResourceLoadEvent}
     *
     * @param event - a resource load event with information about the loaded
     *          resource
     */
    onLoad(event: ResourceLoadEvent): void;
    /**
     * Notifies this ResourceLoadListener that a resource could not be loaded, e.g.
     * because the file could not be found or because the server did not respond.
     * Some browsers do not support any way of detecting load errors. In these
     * cases, onLoad will be called regardless of the status.
     *
     * @see {@link ResourceLoadEvent}
     *
     * @param event - a resource load event with information about the resource
     *          that could not be loaded.
     */
    onError(event: ResourceLoadEvent): void;
}
/** Tracks loaded resources and their listeners; the dedup/fanout kernel of ResourceLoader. */
export declare class ResourceRegistry {
    #private;
    constructor(registry: Registry);
    /** Whether the resource identified by the given key has finished loading. */
    isLoaded(key: string): boolean;
    /** Marks a resource key as already loaded (e.g. discovered in the DOM). */
    markLoaded(key: string): void;
    /** Associates a dependency id with its resource key, for later removal. */
    registerDependencyId(dependencyId: string, resourceKey: string): void;
    /**
     * Registers a load listener for a resource key, returning true if it is the
     * first listener (i.e. the caller should start loading the resource). Mirrors
     * ResourceLoader.addListener.
     */
    addListener(resourceId: string, listener: ResourceLoadListener | null): boolean;
    /** Marks the resource loaded and notifies (then clears) its listeners. Mirrors fireLoad. */
    fireLoad(event: ResourceLoadEvent): void;
    /** Reports the error and notifies (then clears) the resource's listeners. Mirrors fireError. */
    fireError(event: ResourceLoadEvent): void;
    /** Clears a resource (loaded flag + listeners + mapping) by its dependency id. */
    clearLoadedResourceById(dependencyId: string): void;
}
