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
import { assert } from '../assert';
// What Java's assert messages interpolate with Class.getName(): a token is
// either the name itself or the constructor standing in for the class.
function typeName(type) {
    return typeof type === 'function' ? type.name : String(type);
}
/**
 * The service lookup tokens, one per registered singleton. Java keys the lookup
 * table by `Class<?>`; a TypeScript service can be a function rather than a
 * class, so each is keyed by its name instead.
 */
export const TOKEN = {
    MessageSender: 'MessageSender',
    MessageHandler: 'MessageHandler',
    ApplicationConnection: 'ApplicationConnection',
    Heartbeat: 'Heartbeat',
    ConnectionStateHandler: 'ConnectionStateHandler',
    ServerRpcQueue: 'ServerRpcQueue',
    ApplicationConfiguration: 'ApplicationConfiguration',
    StateTree: 'StateTree',
    PushConfiguration: 'PushConfiguration',
    XhrConnection: 'XhrConnection',
    URIResolver: 'URIResolver',
    DependencyLoader: 'DependencyLoader',
    SystemErrorHandler: 'SystemErrorHandler',
    UILifecycle: 'UILifecycle',
    RequestResponseTracker: 'RequestResponseTracker',
    ReconnectConfiguration: 'ReconnectConfiguration',
    ExecuteJavaScriptProcessor: 'ExecuteJavaScriptProcessor',
    ServerConnector: 'ServerConnector',
    ResourceLoader: 'ResourceLoader',
    ConstantPool: 'ConstantPool',
    ExistingElementMap: 'ExistingElementMap',
    InitialPropertiesHandler: 'InitialPropertiesHandler',
    Poller: 'Poller',
    LoadingIndicatorStateHandler: 'LoadingIndicatorStateHandler'
};
/**
 * A registry of singleton instances, such as {@link ServerRpcQueue}, which can be
 * looked up based on their class.
 *
 * A new registry is empty; {@link DefaultRegistry} populates one by calling
 * {@link Registry.set} for each service, as Java's constructor documentation
 * describes.
 */
export class Registry {
    #lookupTable = new Map();
    #resettable = new Map();
    /**
     * Stores an instance of the given type.
     *
     * @param type - the type to store
     * @param instance - the instance to store
     * @typeParam T - the type
     */
    set(type, instance) {
        assert(!this.#lookupTable.has(type), () => `Registry already has a class of type ${typeName(type)} registered`);
        this.#lookupTable.set(type, instance);
    }
    /**
     * Stores an instance created by the given supplier and remembers the supplier
     * so the instance can be recreated by reset(). Mirrors Registry.set(Class,
     * Supplier).
     */
    setResettable(type, instanceSupplier) {
        this.set(type, instanceSupplier());
        this.#resettable.set(type, instanceSupplier);
    }
    /**
     * Gets the instance registered for the given type. Throws if none has been
     * registered. Mirrors Registry.get(Class).
     */
    get(type) {
        assert(this.#lookupTable.has(type), () => `Tried to lookup type ${typeName(type)} but no instance has been registered`);
        return this.#lookupTable.get(type);
    }
    /**
     * Gets the {@link MessageSender} singleton.
     *
     * @returns the {@link MessageSender} singleton
     */
    getMessageSender() {
        return this.get(TOKEN.MessageSender);
    }
    /**
     * Gets the {@link MessageHandler} singleton.
     *
     * @returns the {@link MessageHandler} singleton
     */
    getMessageHandler() {
        return this.get(TOKEN.MessageHandler);
    }
    /**
     * Gets the {@link ApplicationConnection} singleton.
     *
     * @returns the {@link ApplicationConnection} singleton
     */
    getApplicationConnection() {
        return this.get(TOKEN.ApplicationConnection);
    }
    /**
     * Gets the {@link Heartbeat} singleton.
     *
     * @returns the {@link Heartbeat} singleton
     */
    getHeartbeat() {
        return this.get(TOKEN.Heartbeat);
    }
    /**
     * Gets the {@link ConnectionStateHandler} singleton.
     *
     * @returns the {@link ConnectionStateHandler} singleton
     */
    getConnectionStateHandler() {
        return this.get(TOKEN.ConnectionStateHandler);
    }
    /**
     * Gets the {@link ServerRpcQueue} singleton.
     *
     * @returns the {@link ServerRpcQueue} singleton
     */
    getServerRpcQueue() {
        return this.get(TOKEN.ServerRpcQueue);
    }
    /**
     * Gets the {@link ApplicationConfiguration} singleton.
     *
     * @returns the {@link ApplicationConfiguration} singleton
     */
    getApplicationConfiguration() {
        return this.get(TOKEN.ApplicationConfiguration);
    }
    /**
     * Gets the {@link StateTree} singleton.
     *
     * @returns the {@link StateTree} singleton
     */
    getStateTree() {
        return this.get(TOKEN.StateTree);
    }
    /**
     * Gets the {@link PushConfiguration} singleton.
     *
     * @returns the {@link PushConfiguration} singleton
     */
    getPushConfiguration() {
        return this.get(TOKEN.PushConfiguration);
    }
    /**
     * Gets the {@link XhrConnection} singleton.
     *
     * @returns the {@link XhrConnection} singleton
     */
    getXhrConnection() {
        return this.get(TOKEN.XhrConnection);
    }
    /**
     * Gets the {@link URIResolver} singleton.
     *
     * @returns the {@link URIResolver} singleton
     */
    getURIResolver() {
        return this.get(TOKEN.URIResolver);
    }
    /**
     * Gets the {@link DependencyLoader} singleton.
     *
     * @returns the {@link DependencyLoader} singleton
     */
    getDependencyLoader() {
        return this.get(TOKEN.DependencyLoader);
    }
    /**
     * Gets the {@link SystemErrorHandler} singleton.
     *
     * @returns the {@link SystemErrorHandler} singleton
     */
    getSystemErrorHandler() {
        return this.get(TOKEN.SystemErrorHandler);
    }
    /**
     * Gets the {@link UILifecycle} singleton.
     *
     * @returns the {@link UILifecycle} singleton
     */
    getUILifecycle() {
        return this.get(TOKEN.UILifecycle);
    }
    /**
     * Gets the {@link RequestResponseTracker} singleton.
     *
     * @returns the {@link RequestResponseTracker} singleton
     */
    getRequestResponseTracker() {
        return this.get(TOKEN.RequestResponseTracker);
    }
    /**
     * Gets the {@link ReconnectConfiguration} singleton.
     *
     * @returns the {@link ReconnectConfiguration} singleton
     */
    getReconnectConfiguration() {
        return this.get(TOKEN.ReconnectConfiguration);
    }
    /**
     * Gets the {@link ExecuteJavaScriptProcessor} singleton.
     *
     * @returns the {@link ExecuteJavaScriptProcessor} singleton
     */
    getExecuteJavaScriptProcessor() {
        return this.get(TOKEN.ExecuteJavaScriptProcessor);
    }
    /**
     * Gets the {@link ServerConnector} singleton.
     *
     * @returns the {@link ServerConnector} singleton
     */
    getServerConnector() {
        return this.get(TOKEN.ServerConnector);
    }
    /**
     * Gets the {@link ResourceLoader} singleton.
     *
     * @returns the {@link ResourceLoader} singleton
     */
    getResourceLoader() {
        return this.get(TOKEN.ResourceLoader);
    }
    /**
     * Gets the {@link ConstantPool} singleton.
     *
     * @returns the {@link ConstantPool} singleton
     */
    getConstantPool() {
        return this.get(TOKEN.ConstantPool);
    }
    /**
     * Gets the {@link ExistingElementMap} singleton.
     *
     * @returns the {@link ExistingElementMap} singleton
     */
    getExistingElementMap() {
        return this.get(TOKEN.ExistingElementMap);
    }
    /**
     * Gets the {@link InitialPropertiesHandler} singleton.
     *
     * @returns the {@link InitialPropertiesHandler} singleton
     */
    getInitialPropertiesHandler() {
        return this.get(TOKEN.InitialPropertiesHandler);
    }
    /**
     * Gets the {@link Poller} singleton.
     *
     * @returns the {@link Poller} singleton
     */
    getPoller() {
        return this.get(TOKEN.Poller);
    }
    /**
     * Gets the {@link LoadingIndicatorStateHandler} singleton.
     *
     * @returns the {@link LoadingIndicatorStateHandler} singleton
     */
    getLoadingIndicatorStateHandler() {
        return this.get(TOKEN.LoadingIndicatorStateHandler);
    }
    /**
     * Deletes and recreates resettable instances of registry singletons.
     */
    reset() {
        this.#resettable.forEach((supplier, key) => {
            this.#lookupTable.delete(key);
            this.#lookupTable.set(key, supplier());
        });
    }
}
//# sourceMappingURL=Registry.js.map