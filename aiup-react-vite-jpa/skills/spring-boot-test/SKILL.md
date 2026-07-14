---
name: spring-boot-test
description: >
  Creates Spring Boot integration tests for REST controllers and Spring Data
  JPA repositories covering the main success scenario, alternative flows, and
  business rules of a use case. Use when the user asks to "write backend
  tests", "test the REST API", "test the controller", "write a Spring Boot
  test", "test the JPA repository", or mentions MockMvc, WebTestClient,
  @SpringBootTest, or server-side Java testing for this stack.
---

# Spring Boot Test

## Instructions

Create Spring Boot tests for the use case $ARGUMENTS that exercise the real
`@RestController` → service → Spring Data JPA repository → test database stack
in one process — no browser, no separate frontend build involved. This is the
JPA/Spring equivalent of a server-side component test: it runs entirely inside
the JVM against a real (test) database.

If the JavaDocs MCP server is configured, use it for Spring Boot Test /
AssertJ API lookups; otherwise rely on your own knowledge and the
documentation links below. See [the MCP setup rule](../../rules/mcp-servers.md)
to configure this optional server.

## Test Class Naming and `@UseCase` Annotation

These are **use case tests**. Each test class verifies the behavior of exactly
one use case from the use case specification (`docs/use-cases/UC-XXX-*.md`).

### Class naming

Test classes must be named after the use case using the pattern
`UC<id><PascalCaseUseCaseName>Test` — for example `UC001RegisterPersonTest` for
use case UC-001 "Register Person". This makes the link between spec and test
obvious and is the convention the AIUP IntelliJ Navigator plugin relies on.

### `@UseCase` annotation

Every test method must be annotated with `@UseCase(id = "UC-XXX", ...)` so the
[AIUP IntelliJ Navigator plugin](https://github.com/AI-Unified-Process/intellij-plugin) can wire up
gutter icons and Find Usages between the Markdown spec and the Java tests.

**Bootstrap step.** Before writing any tests, check whether the project already
contains an annotation type named `UseCase` (search the project for
`@interface UseCase`). If it does not, create it. The package does not matter —
the plugin resolves the annotation by short name — but a conventional location
is `src/main/java/<group>/<artifact>/usecase/UseCase.java`. The annotation must
have exactly this shape:

```java
package com.example.app.usecase;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface UseCase {
    String id();

    String scenario() default "Main Success Scenario";

    String[] businessRules() default {};
}
```

### Usage on test methods

Annotate each test method with the use case ID and (when applicable) the
scenario and business rules it covers. The values must match headings in the
corresponding `UC-XXX-*.md` spec:

| Attribute       | Maps to spec heading                      | Default                   |
|-----------------|-------------------------------------------|---------------------------|
| `id`            | `**Use Case ID:** UC-XXX`                 | (required)                |
| `scenario`      | `## Main Success Scenario` or `### A1: …` | `"Main Success Scenario"` |
| `businessRules` | `### BR-XXX` headings inside the same UC  | `{}`                      |

```java

@Test
@UseCase(id = "UC-001")
void register_person_with_valid_data() { ...}

@Test
@UseCase(id = "UC-001", scenario = "A1: Email Already Exists")
void registration_fails_when_email_already_exists() { ...}

@Test
@UseCase(id = "UC-001", scenario = "A2: Invalid Postal Code", businessRules = {"BR-003"})
void registration_fails_when_postal_code_invalid() { ...}
```

## DO NOT

- Mock the repository or service layer with Mockito — exercise the real
  `@RestController` → service → repository → database stack
- Use `@MockBean`/`@MockitoBean` on anything in the use case's own call chain
- Delete all data in cleanup (only remove data created during the test)
- Assert on the JPA `@Entity` directly when the controller returns a DTO —
  assert on the response body / DTO shape actually returned over the wire

## Test Data Strategy

Create test data using Flyway migrations in `src/test/resources/db/migration`.

| Approach         | Location                               | Purpose                  |
|------------------|----------------------------------------|--------------------------|
| Flyway migration | src/test/resources/db/migration/V*.sql | Populate test data       |
| Manual cleanup   | @AfterEach method                      | Remove test-created data |

## Base Test Setup

Annotate the class with `@SpringBootTest` and `@AutoConfigureMockMvc`, and
autowire `MockMvc` to drive the controller through real HTTP semantics
(status codes, JSON body, headers) rather than calling the controller method
directly as a plain Java call.

```java

@SpringBootTest
@AutoConfigureMockMvc
class RoomTypeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @UseCase(id = "UC-001")
    void lists_all_room_types() throws Exception {
        mockMvc.perform(get("/api/room-types"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Deluxe Suite"));
    }
}
```

For reactive stacks (Spring WebFlux), use `WebTestClient` instead of `MockMvc`
following the same annotation and assertion conventions.

## Repository-Level Tests

When a use case's business rule lives in a custom repository query rather than
the controller (e.g. a derived query method or `@Query`), test it directly with
`@DataJpaTest` against the same Flyway-seeded test data — still no mocking, and
still tagged with `@UseCase`:

```java

@DataJpaTest
class RoomTypeRepositoryTest {

    @Autowired
    private RoomTypeRepository repository;

    @Test
    @UseCase(id = "UC-001", scenario = "A1: Filter by Capacity")
    void finds_room_types_with_minimum_capacity() {
        List<RoomType> result = repository.findByCapacityGreaterThanEqual(4);

        assertThat(result).extracting(RoomType::getName).contains("Family Room");
    }
}
```

## Assertions Reference

Use AssertJ and MockMvc's `jsonPath`/`content` matchers.

| Assertion Type    | Example                                                |
|-------------------|--------------------------------------------------------|
| HTTP status       | `.andExpect(status().isOk())`                          |
| JSON field value  | `.andExpect(jsonPath("$.name").value("Deluxe Suite"))` |
| JSON array size   | `.andExpect(jsonPath("$", hasSize(3)))`                |
| Repository result | `assertThat(result).hasSize(3)`                        |
| DTO field         | `assertThat(dto.name()).isEqualTo("Deluxe Suite")`     |
| Error response    | `.andExpect(status().isBadRequest())`                  |

## Workflow

1. Read the use case specification (`docs/use-cases/UC-XXX-*.md`) to identify
   the main success scenario, alternative flows (A1, A2, …), and referenced
   business rules (BR-XXX)
2. Check whether a `UseCase` annotation type already exists in the project. If
   not, create `UseCase.java` with the canonical shape shown above
3. Create the test class named `UC<id><PascalCaseUseCaseName>Test`, annotated
   `@SpringBootTest` (with `@AutoConfigureMockMvc` if it exercises the REST
   layer, or `@DataJpaTest` if it only exercises a repository query)
4. For each test method:
    - Annotate with `@UseCase(id = "UC-XXX", scenario = "…", businessRules = {"BR-…"})`
      mirroring the spec headings
    - Drive the request through `MockMvc`/`WebTestClient`, or call the
      repository directly for `@DataJpaTest` cases
    - Assert outcomes with AssertJ / `jsonPath`
    - Clean up test data if created during the test
5. Run the tests to verify they pass
6. If a test fails:
    - Check the Flyway test migration actually seeded the expected rows
    - Verify the JSON path matches the DTO's actual field names (not the
      entity's)
    - For repository tests, confirm the query method name/`@Query` matches
      the intended filter
7. Mark todos complete

## Resources

- Spring Boot Testing documentation: https://docs.spring.io/spring-boot/reference/testing/index.html
- MockMvc reference: https://docs.spring.io/spring-framework/reference/testing/spring-mvc-test-framework.html
- `@DataJpaTest`
  reference: https://docs.spring.io/spring-boot/reference/testing/spring-boot-applications.html#testing.spring-boot-applications.autoconfigured-tests
- AIUP IntelliJ Navigator plugin (defines the `@UseCase` annotation
  contract): https://github.com/AI-Unified-Process/intellij-plugin
- If configured, use the JavaDocs MCP server for additional API lookups (`https://www.javadocs.dev/mcp`)
