import type { Command } from './Command';
/**
 * Adds a command to be run when all eager dependencies have finished loading.
 *
 * If no eager dependencies are currently being loaded, runs the command
 * immediately.
 *
 * @see {@link startEagerDependencyLoading}
 * @see {@link endEagerDependencyLoading}
 *
 * @param command - the command to run when eager dependencies have been loaded
 */
export declare function runWhenEagerDependenciesLoaded(command: Command): void;
/**
 * Marks that loading of a dependency has started.
 *
 * @see {@link runWhenEagerDependenciesLoaded}
 * @see {@link endEagerDependencyLoading}
 */
export declare function startEagerDependencyLoading(): void;
/**
 * Marks that loading of a dependency has ended.
 *
 * If all pending dependencies have been loaded, calls any callback registered
 * using {@link runWhenEagerDependenciesLoaded}. The callbacks are cleared even
 * if one of them throws.
 */
export declare function endEagerDependencyLoading(): void;
