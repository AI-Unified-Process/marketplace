import type { Registry } from './Registry';
import { type ResourceLoadListener } from './ResourceRegistry';
/**
 * ResourceLoader lets you dynamically include external scripts and styles on
 * the page and lets you know when the resource has been loaded.
 *
 * You can also preload resources, allowing them to get cached by the browser
 * without being evaluated. This enables downloading multiple resources at once
 * while still controlling in which order e.g. scripts are executed.
 */
export declare class ResourceLoader {
    #private;
    /**
     * Creates a new resource loader. You should not create you own resource
     * loader, but instead use `Registry.getResourceLoader()` to get an instance.
     *
     * @param registry - the global registry
     * @param initFromDom - `true` if currently loaded resources should be marked
     *          as loaded, `false` to ignore currently loaded resources
     */
    constructor(registry: Registry, initFromDom: boolean);
    /**
     * Clears a resource from the loaded resources set by its dependency ID.
     *
     * This is used when a resource is removed from the DOM using its dependency
     * ID.
     *
     * @param dependencyId - the dependency ID of the resource to clear
     */
    clearLoadedResourceById(dependencyId: string): void;
    /**
     * Load a script and notify a listener when the script is loaded. Calling
     * this method when the script is currently loading or already loaded
     * doesn't cause the script to be loaded again, but the listener will still
     * be notified when appropriate.
     *
     * Loads all dependencies with `async = false` and
     * `defer = false` attribute values, see
     * {@link ResourceLoader.loadScript}.
     *
     * @param scriptUrl - the url of the script to load
     * @param resourceLoadListener - the listener that will get notified when the script is loaded
     */
    loadScript(scriptUrl: string, resourceLoadListener: ResourceLoadListener | null, async?: boolean, defer?: boolean, type?: string): void;
    /**
     * Load a script with type module and notify a listener when the script is
     * loaded. Calling this method when the script is currently loading or
     * already loaded doesn't cause the script to be loaded again, but the
     * listener will still be notified when appropriate.
     *
     *
     * @param scriptUrl - url of script to load. It should be an external URL.
     * @param resourceLoadListener - listener to notify when script is loaded
     * @param async - What mode the script.async attribute should be set to
     * @param defer - What mode the script.defer attribute should be set to
     */
    loadJsModule(scriptUrl: string, resourceLoadListener: ResourceLoadListener | null, async?: boolean, defer?: boolean): void;
    /**
     * Inlines a script and notify a listener when the script is loaded. Calling
     * this method when the script is currently loading or already loaded
     * doesn't cause the script to be loaded again, but the listener will still
     * be notified when appropriate.
     *
     * @param scriptContents - the script contents to inline
     * @param resourceLoadListener - listener to notify when script is loaded
     */
    inlineScript(scriptContents: string, resourceLoadListener: ResourceLoadListener | null): void;
    /**
     * Load a stylesheet and notify a listener when the stylesheet is loaded.
     * Calling this method when the stylesheet is currently loading or already
     * loaded doesn't cause the stylesheet to be loaded again, but the listener
     * will still be notified when appropriate.
     *
     * @param stylesheetUrl - the url of the stylesheet to load
     * @param resourceLoadListener - the listener that will get notified when the stylesheet is loaded
     */
    loadStylesheet(stylesheetUrl: string, resourceLoadListener: ResourceLoadListener | null, dependencyId?: string | null): void;
    /**
     * Inlines a stylesheet and notify a listener when the stylesheet is loaded.
     * Calling this method when the stylesheet is currently loading or already
     * loaded doesn't cause the stylesheet to be loaded again, but the listener
     * will still be notified when appropriate.
     *
     * @param styleSheetContents - the contents to inline
     * @param resourceLoadListener - the listener that will get notified when the stylesheet is loaded
     */
    inlineStyleSheet(styleSheetContents: string, resourceLoadListener: ResourceLoadListener | null, dependencyId?: string | null): void;
    /**
     * Loads a dynamic import via the provided JS `expression` and reports
     * the result via the `resourceLoadListener`.
     *
     * @param expression - the JS expression which returns a Promise
     * @param resourceLoadListener - a listener to report the Promise result exection
     */
    loadDynamicImport(expression: string, resourceLoadListener: ResourceLoadListener): void;
}
/**
 * Adds an onload listener to the given element, which should be a link or a
 * script tag. The listener is called whenever loading is complete or an
 * error occurred.
 *
 * @param element - the element to attach a listener to
 * @param onLoad - called when loading completed; Java passes a single listener
 *          plus the event to hand it, which the port splits into the two
 *          callbacks below
 * @param onError - called when loading failed
 */
export declare function addOnloadHandler(element: Element, onLoad: () => void, onError: () => void): void;
