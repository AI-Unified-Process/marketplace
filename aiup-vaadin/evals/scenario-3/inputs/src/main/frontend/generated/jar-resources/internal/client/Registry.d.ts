import type { MessageSender } from './communication/MessageSender';
import type { MessageHandler } from './communication/MessageHandler';
import type { ApplicationConnection } from './ApplicationConnection';
import type { Heartbeat } from './communication/Heartbeat';
import type { ConnectionStateHandler } from './communication/ConnectionStateHandler';
import type { ServerRpcQueue } from './communication/ServerRpcQueue';
import type { ApplicationConfiguration } from './ApplicationConfiguration';
import type { StateTree } from './flow/StateTree';
import type { PushConfiguration } from './communication/PushConfiguration';
import type { XhrConnection } from './communication/XhrConnection';
import type { URIResolver } from './URIResolver';
import type { DependencyLoader } from './DependencyLoader';
import type { SystemErrorHandler } from './SystemErrorHandler';
import type { UILifecycle } from './UILifecycle';
import type { RequestResponseTracker } from './communication/RequestResponseTracker';
import type { ReconnectConfiguration } from './communication/ReconnectConfiguration';
import type { ExecuteJavaScriptProcessor } from './flow/ExecuteJavaScriptProcessor';
import type { ServerConnector } from './communication/ServerConnector';
import type { ResourceLoader } from './ResourceLoader';
import type { ConstantPool } from './flow/ConstantPool';
import type { ExistingElementMap } from './ExistingElementMap';
import type { InitialPropertiesHandler } from './InitialPropertiesHandler';
import type { Poller } from './communication/Poller';
import type { LoadingIndicatorStateHandler } from './communication/LoadingIndicatorStateHandler';
/** A token identifying a registered service (its class/constructor, a symbol, or a name). */
export type ServiceKey = unknown;
/**
 * The service lookup tokens, one per registered singleton. Java keys the lookup
 * table by `Class<?>`; a TypeScript service can be a function rather than a
 * class, so each is keyed by its name instead.
 */
export declare const TOKEN: {
    readonly MessageSender: "MessageSender";
    readonly MessageHandler: "MessageHandler";
    readonly ApplicationConnection: "ApplicationConnection";
    readonly Heartbeat: "Heartbeat";
    readonly ConnectionStateHandler: "ConnectionStateHandler";
    readonly ServerRpcQueue: "ServerRpcQueue";
    readonly ApplicationConfiguration: "ApplicationConfiguration";
    readonly StateTree: "StateTree";
    readonly PushConfiguration: "PushConfiguration";
    readonly XhrConnection: "XhrConnection";
    readonly URIResolver: "URIResolver";
    readonly DependencyLoader: "DependencyLoader";
    readonly SystemErrorHandler: "SystemErrorHandler";
    readonly UILifecycle: "UILifecycle";
    readonly RequestResponseTracker: "RequestResponseTracker";
    readonly ReconnectConfiguration: "ReconnectConfiguration";
    readonly ExecuteJavaScriptProcessor: "ExecuteJavaScriptProcessor";
    readonly ServerConnector: "ServerConnector";
    readonly ResourceLoader: "ResourceLoader";
    readonly ConstantPool: "ConstantPool";
    readonly ExistingElementMap: "ExistingElementMap";
    readonly InitialPropertiesHandler: "InitialPropertiesHandler";
    readonly Poller: "Poller";
    readonly LoadingIndicatorStateHandler: "LoadingIndicatorStateHandler";
};
/**
 * A registry of singleton instances, such as {@link ServerRpcQueue}, which can be
 * looked up based on their class.
 *
 * A new registry is empty; {@link DefaultRegistry} populates one by calling
 * {@link Registry.set} for each service, as Java's constructor documentation
 * describes.
 */
export declare class Registry {
    #private;
    /**
     * Stores an instance of the given type.
     *
     * @param type - the type to store
     * @param instance - the instance to store
     * @typeParam T - the type
     */
    protected set<T>(type: ServiceKey, instance: T): void;
    /**
     * Stores an instance created by the given supplier and remembers the supplier
     * so the instance can be recreated by reset(). Mirrors Registry.set(Class,
     * Supplier).
     */
    protected setResettable<T>(type: ServiceKey, instanceSupplier: () => T): void;
    /**
     * Gets the instance registered for the given type. Throws if none has been
     * registered. Mirrors Registry.get(Class).
     */
    protected get<T>(type: ServiceKey): T;
    /**
     * Gets the {@link MessageSender} singleton.
     *
     * @returns the {@link MessageSender} singleton
     */
    getMessageSender(): MessageSender;
    /**
     * Gets the {@link MessageHandler} singleton.
     *
     * @returns the {@link MessageHandler} singleton
     */
    getMessageHandler(): MessageHandler;
    /**
     * Gets the {@link ApplicationConnection} singleton.
     *
     * @returns the {@link ApplicationConnection} singleton
     */
    getApplicationConnection(): ApplicationConnection;
    /**
     * Gets the {@link Heartbeat} singleton.
     *
     * @returns the {@link Heartbeat} singleton
     */
    getHeartbeat(): Heartbeat;
    /**
     * Gets the {@link ConnectionStateHandler} singleton.
     *
     * @returns the {@link ConnectionStateHandler} singleton
     */
    getConnectionStateHandler(): ConnectionStateHandler;
    /**
     * Gets the {@link ServerRpcQueue} singleton.
     *
     * @returns the {@link ServerRpcQueue} singleton
     */
    getServerRpcQueue(): ServerRpcQueue;
    /**
     * Gets the {@link ApplicationConfiguration} singleton.
     *
     * @returns the {@link ApplicationConfiguration} singleton
     */
    getApplicationConfiguration(): ApplicationConfiguration;
    /**
     * Gets the {@link StateTree} singleton.
     *
     * @returns the {@link StateTree} singleton
     */
    getStateTree(): StateTree;
    /**
     * Gets the {@link PushConfiguration} singleton.
     *
     * @returns the {@link PushConfiguration} singleton
     */
    getPushConfiguration(): PushConfiguration;
    /**
     * Gets the {@link XhrConnection} singleton.
     *
     * @returns the {@link XhrConnection} singleton
     */
    getXhrConnection(): XhrConnection;
    /**
     * Gets the {@link URIResolver} singleton.
     *
     * @returns the {@link URIResolver} singleton
     */
    getURIResolver(): URIResolver;
    /**
     * Gets the {@link DependencyLoader} singleton.
     *
     * @returns the {@link DependencyLoader} singleton
     */
    getDependencyLoader(): DependencyLoader;
    /**
     * Gets the {@link SystemErrorHandler} singleton.
     *
     * @returns the {@link SystemErrorHandler} singleton
     */
    getSystemErrorHandler(): SystemErrorHandler;
    /**
     * Gets the {@link UILifecycle} singleton.
     *
     * @returns the {@link UILifecycle} singleton
     */
    getUILifecycle(): UILifecycle;
    /**
     * Gets the {@link RequestResponseTracker} singleton.
     *
     * @returns the {@link RequestResponseTracker} singleton
     */
    getRequestResponseTracker(): RequestResponseTracker;
    /**
     * Gets the {@link ReconnectConfiguration} singleton.
     *
     * @returns the {@link ReconnectConfiguration} singleton
     */
    getReconnectConfiguration(): ReconnectConfiguration;
    /**
     * Gets the {@link ExecuteJavaScriptProcessor} singleton.
     *
     * @returns the {@link ExecuteJavaScriptProcessor} singleton
     */
    getExecuteJavaScriptProcessor(): ExecuteJavaScriptProcessor;
    /**
     * Gets the {@link ServerConnector} singleton.
     *
     * @returns the {@link ServerConnector} singleton
     */
    getServerConnector(): ServerConnector;
    /**
     * Gets the {@link ResourceLoader} singleton.
     *
     * @returns the {@link ResourceLoader} singleton
     */
    getResourceLoader(): ResourceLoader;
    /**
     * Gets the {@link ConstantPool} singleton.
     *
     * @returns the {@link ConstantPool} singleton
     */
    getConstantPool(): ConstantPool;
    /**
     * Gets the {@link ExistingElementMap} singleton.
     *
     * @returns the {@link ExistingElementMap} singleton
     */
    getExistingElementMap(): ExistingElementMap;
    /**
     * Gets the {@link InitialPropertiesHandler} singleton.
     *
     * @returns the {@link InitialPropertiesHandler} singleton
     */
    getInitialPropertiesHandler(): InitialPropertiesHandler;
    /**
     * Gets the {@link Poller} singleton.
     *
     * @returns the {@link Poller} singleton
     */
    getPoller(): Poller;
    /**
     * Gets the {@link LoadingIndicatorStateHandler} singleton.
     *
     * @returns the {@link LoadingIndicatorStateHandler} singleton
     */
    getLoadingIndicatorStateHandler(): LoadingIndicatorStateHandler;
    /**
     * Deletes and recreates resettable instances of registry singletons.
     */
    reset(): void;
}
