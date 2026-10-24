import type { ApplicationConnection as PublishedClient } from './clientApi';
import type { ApplicationConfiguration } from './ApplicationConfiguration';
import type { Registry } from './Registry';
import type { ValueMap } from './ValueMap';
/**
 * Main class for an application / UI.
 *
 * Initializes the registry and starts the application.
 */
export declare class ApplicationConnection implements PublishedClient {
    #private;
    constructor(registry: Registry);
    /**
     * Creates an application connection using the given configuration: assembles
     * the {@link DefaultRegistry}, binds the root state node to the page body, and
     * publishes the client API through {@link publishClient}. Mirrors the
     * ApplicationConnection.java constructor.
     *
     * @param applicationConfiguration - the configuration object for the application
     * @returns the connection, already published
     */
    static create(applicationConfiguration: ApplicationConfiguration): ApplicationConnection;
    /**
     * Starts this application. Public access is required for web components.
     *
     * @param initialUidl - the initial UIDL or null if the server did not provide
     *          any
     */
    start(initialUidl: ValueMap | null): void;
    /**
     * Checks if there is some work to be done on the client side.
     *
     * @returns true if the client has some work to be done, false otherwise
     */
    isActive(): boolean;
    /** The DOM node bound to the state node with the given id, or null. */
    getDomElementByNodeId(id: number): Node | null;
    /** The state node id bound to the given DOM element, or -1 if none. */
    getNodeId(element: Element): number;
    /** The id of the UI this connection is connected to. */
    getUIId(): number;
    /** Runs the callback once the DOM node for the given state node id is set. */
    addDomSetListener(nodeId: number, callback: () => void): void;
    /** Triggers a server poll. */
    poll(): void;
    /** Connects the web component described by the event data with the server. */
    connectWebComponent(eventData: unknown): void;
    /** Profiling data for the last request (processing times + server timing + bootstrap). */
    getProfilingData(): number[];
    /** Resolves a Vaadin URI (context://, base://) to an absolute URL. */
    resolveUri(uri: string): string | null;
    /** Sends an event message to the server. */
    sendEventMessage(nodeId: number, eventType: string, eventData: unknown): void;
    /** A JSON description of the root node's state tree, for debugging. */
    debug(): unknown;
    /** The Java class name bound to the state node with the given id, or null. */
    getJavaClass(id: number): string | null;
    /** Whether the element for the given state node id is hidden by the server. */
    isHiddenByServer(id: number): boolean;
    /** The element style properties for the given state node id, as a plain object. */
    getElementStyleProperties(id: number): Record<string, unknown>;
}
