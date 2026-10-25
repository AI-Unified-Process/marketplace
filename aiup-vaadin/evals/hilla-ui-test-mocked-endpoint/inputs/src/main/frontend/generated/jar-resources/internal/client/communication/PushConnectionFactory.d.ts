import type { PushConnection } from './PushConnection';
/**
 * Factory for {@link PushConnection}.
 *
 * Produces a {@link PushConnection} for the provided {@link Registry}.
 */
export type PushConnectionFactory = (registry: unknown) => PushConnection;
