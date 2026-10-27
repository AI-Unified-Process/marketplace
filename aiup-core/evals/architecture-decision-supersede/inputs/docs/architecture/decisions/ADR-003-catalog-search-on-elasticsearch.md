# ADR-003: Catalog search runs on Elasticsearch

**Status:** Rejected
**Date:** 2026-09-20
**Requirements:** NFR-002

## Context

NFR-002 asks for the first page of a catalog search within 1 second for 500,000 titles. ADR-002's LIKE queries scan the
whole table; a search engine would answer within the limit at any catalog size.

## Decision

The catalog is indexed in an Elasticsearch cluster, kept in step with PostgreSQL by an outbox, and the search queries
Elasticsearch.

## Consequences

- Fast search with relevance ranking.
- A second data store to operate, back up, and keep in step.
- Rejected: the library's IT has no one to operate a search cluster, and C-001 keeps PostgreSQL as the only data store.
