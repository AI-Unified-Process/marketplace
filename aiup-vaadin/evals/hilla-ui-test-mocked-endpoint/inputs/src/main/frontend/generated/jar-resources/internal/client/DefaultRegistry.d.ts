import type { ApplicationConfiguration } from './ApplicationConfiguration';
import type { ApplicationConnection } from './ApplicationConnection';
import { Registry } from './Registry';
/**
 * A registry implementation used by {@link ApplicationConnection}.
 */
export declare class DefaultRegistry extends Registry {
    /**
     * Constructs a registry based on the given configuration reference.
     *
     * Java also takes the application connection here, because the registry is
     * constructed from inside ApplicationConnection's constructor; the port
     * registers it through {@link DefaultRegistry.setApplicationConnection} instead.
     *
     * @param applicationConfiguration - the application configuration
     */
    constructor(applicationConfiguration: ApplicationConfiguration);
    /**
     * Stores the application connection this registry belongs to.
     *
     * Java takes the connection as the first constructor parameter, because the
     * registry is constructed from inside ApplicationConnection's constructor. The
     * port assembles the registry first and hands the connection over as soon as it
     * exists, which is before anything can look it up.
     *
     * @param connection - the application connection
     */
    setApplicationConnection(connection: ApplicationConnection): void;
}
