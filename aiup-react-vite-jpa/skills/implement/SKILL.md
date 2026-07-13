---
name: implement
description: >
  Implements use cases by creating a Spring Data JPA data access layer and REST
  API for the backend, and a React view/component wired to that API for the
  frontend. Use when the user asks to "implement a use case", "build the API",
  "create a REST endpoint", "write the data access layer", "build the React
  page", or mentions Spring Boot, JPA/Hibernate entities, or a React/Vite
  frontend calling a Java backend.
---

# Implement Use Case

## Instructions

Implement the use case $ARGUMENTS across both halves of the stack: a Spring Boot
REST API backed by Spring Data JPA on the backend, and a React (TypeScript)
page/component on the frontend that calls that API. This is a split
client/server architecture, not a single server-rendered UI — the backend and
frontend are independent builds that only share a JSON contract over HTTP.

Don't create tests — there are the `spring-boot-test`, `vitest-test`, and
`playwright-test` skills for that.

If the JavaDocs MCP server is configured, check it for Spring/Hibernate API
lookups; otherwise rely on your own knowledge and the documentation links
below.

## DO NOT

- Create test classes or test files (use the dedicated testing skills instead)
- Return `@Entity` objects directly from a `@RestController` — map to a DTO
- Set `spring.jpa.hibernate.ddl-auto` to `update` or `create` — the schema is
  owned by Flyway migrations (`ddl-auto=validate`)
- Put business logic in the controller — controllers delegate to a service class
- Reach for a new state-management library per use case — use the project's
  existing convention (default: TanStack Query for server state) consistently

## Workflow

1. Read the use case specification from `docs/use_cases/`
2. Read the entity model from `docs/entity_model.md`
3. Check existing backend (package layout, DTO conventions) and frontend
   (routing, folder structure, data-fetching convention) code for patterns
4. Implement the backend:
    1. `@Entity` class mapped onto the table the `flyway-migration` skill
       already created — field names in `camelCase`, matching the migration's
       `snake_case` columns via Hibernate's default naming strategy
    2. A Spring Data JPA `Repository` interface
    3. A service class containing the use case logic
    4. A `@RestController` exposing the service through DTOs (records)
    5. Verify the backend compiles and, if a build tool is configured, builds
       successfully
5. Implement the frontend:
    1. A React (TypeScript) page or component under the project's existing
       routing convention
    2. An API client function/hook calling the REST endpoint (fetch + TanStack
       Query by default, unless the project already uses something else)
    3. Wire the component to the API client per the use case's flow (forms,
       lists, actions)
    4. Verify the frontend builds/lints successfully
6. Confirm the backend and frontend agree on the JSON shape (field names,
   types, nullability) before considering the use case done

## Data Layer: DTO Projections

Never let a `@RestController` serialize a JPA `@Entity` directly — it leaks
lazy-loading proxies, persistence-context state, and internal fields, and
couples the wire format to the schema. Map to a `record` DTO in the service
layer instead:

```java
public record RoomTypeDto(Long id, String name, String description, int capacity, BigDecimal price) {
}

@Service
public class RoomTypeService {
    private final RoomTypeRepository repository;

    public RoomTypeService(RoomTypeRepository repository) {
        this.repository = repository;
    }

    public List<RoomTypeDto> findAll() {
        return repository.findAll().stream()
                .map(rt -> new RoomTypeDto(rt.getId(), rt.getName(), rt.getDescription(), rt.getCapacity(), rt.getPrice()))
                .toList();
    }
}

@RestController
@RequestMapping("/api/room-types")
public class RoomTypeController {
    private final RoomTypeService service;

    public RoomTypeController(RoomTypeService service) {
        this.service = service;
    }

    @GetMapping
    public List<RoomTypeDto> findAll() {
        return service.findAll();
    }
}
```

For read-heavy queries where you only need a subset of columns, project directly
in the repository with a Spring Data JPA interface projection instead of loading
the full entity:

```java
public interface RoomTypeSummary {
    Long getId();

    String getName();
}

public interface RoomTypeRepository extends JpaRepository<RoomType, Long> {
    List<RoomTypeSummary> findAllBy(); // interface projection, not the full entity
}
```

## Frontend: Calling the API

```tsx
// api/roomTypes.ts
export interface RoomType {
    id: number;
    name: string;
    description: string;
    capacity: number;
    price: number;
}

export async function fetchRoomTypes(): Promise<RoomType[]> {
    const response = await fetch("/api/room-types");
    if (!response.ok) throw new Error(`Failed to load room types: ${response.status}`);
    return response.json();
}
```

```tsx
// RoomTypeList.tsx
import { useQuery } from "@tanstack/react-query";
import { fetchRoomTypes } from "./api/roomTypes";

export function RoomTypeList() {
    const { data, isLoading, error } = useQuery({ queryKey: ["room-types"], queryFn: fetchRoomTypes });

    if (isLoading) return <p>Loading…</p>;
    if (error) return <p role="alert">Could not load room types.</p>;

    return (
        <ul>
            {data!.map((rt) => (
                <li key={rt.id}>{rt.name} — {rt.capacity} guests</li>
            ))}
        </ul>
    );
}
```

## Resources

- If configured, use the JavaDocs MCP server for Spring/Hibernate API documentation (`https://www.javadocs.dev/mcp`)
- If `aiup-core` is installed, its context7 MCP server covers React, Vite, and TanStack Query docs
- See [the MCP setup rule](../../rules/mcp-servers.md) to configure these optional servers
