import type { Registry } from './Registry';
export type LoadMode = 'INLINE' | 'EAGER' | 'LAZY';
export type Dependency = Record<string, unknown>;
/**
 * Handles loading of dependencies (stylesheets and scripts) in the application.
 */
export declare class DependencyLoader {
    #private;
    /**
     * Creates a new instance connected to the given registry.
     *
     * @param registry - the global registry
     */
    constructor(registry: Registry);
    /**
     * Triggers loading of the given dependencies.
     *
     * @param clientDependencies - the map of the dependencies to load, divided into groups by load mode, not `null`.
     */
    loadDependencies(clientDependencies: Map<LoadMode, Dependency[]>): void;
}
