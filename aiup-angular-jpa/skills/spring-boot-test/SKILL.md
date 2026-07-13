---
name: spring-boot-test
description: >
  Creates Spring Boot tests for REST controllers and Spring Data JPA
  repositories, detecting and following whichever integration-test convention
  a project already uses (RestAssured + Testcontainers, or MockMvc). Use when
  the user asks to "write backend tests", "test the REST API", "test the
  controller", "write a Spring Boot test", "test the JPA repository", or
  mentions MockMvc, RestAssured, Testcontainers, @SpringBootTest, or
  server-side Java testing for this stack.
---

# Spring Boot Test

## Instructions

Create Spring Boot tests for the use case $ARGUMENTS. This skill supports two
established conventions and **detects which one a project already uses rather
than defaulting blindly** — always match what's already there over this
skill's own preference.

If the JavaDocs MCP server is configured, use it for Spring Boot Test /
RestAssured / Testcontainers / AssertJ API lookups; otherwise rely on your own
knowledge and the documentation links below. See
[the MCP setup rule](../../rules/mcp-servers.md) to configure this optional
server.

## Step 0: Detect the Existing Convention

Before writing anything, search the backend's test sources:

- If `@AutoConfigureMockMvc` / `MockMvc` appears anywhere → use **MockMvc**
  for the new test, matching the existing pattern exactly.
- If `@Testcontainers` / `RestAssured` / `RANDOM_PORT` appears anywhere → use
  **RestAssured + Testcontainers**, reusing any existing abstract base class
  (e.g. `IntegrationTestBase`) rather than duplicating its setup.
- **If neither exists yet (first test in the project), default to RestAssured
    + Testcontainers, not MockMvc.** This exercises the real HTTP wire format
      across genuine module/process boundaries — important once `domain`,
      `business`, `postgres`, and `api` are separate Maven modules glued together
      only by the composition-root module — and it runs against a real Postgres
      container instead of H2, avoiding SQL-dialect drift from Postgres-targeted
      Flyway migrations.

Never switch an existing project's already-established convention mid-stream
because this skill "prefers" the other one.

## Test Class Naming and `@UseCase` Annotation

These are **use case tests**. Each test class verifies the behavior of exactly
one use case from the use case specification (`docs/use-cases/UC-XXX-*.md`).

### Class naming

Test classes must be named after the use case using the pattern
`UC<id><PascalCaseUseCaseName>Test` — for example `UC001RegisterGuestTest` for
use case UC-001 "Register Guest". This makes the link between spec and test
obvious and is the convention the AIUP IntelliJ Navigator plugin relies on.

### `@UseCase` annotation

Every test method must be annotated with `@UseCase(id = "UC-XXX", ...)` so the
[AIUP IntelliJ Navigator plugin](https://github.com/AI-Unified-Process/intellij-plugin) can wire up
gutter icons and Find Usages between the Markdown spec and the Java tests.

**Bootstrap step.** Before writing any tests, check whether the project already
contains an annotation type named `UseCase` (search the project for
`@interface UseCase`). If it does not, create it. In a hexagonal multi-module
project, place it in the **composition-root module** (e.g. `*-app`) — that's
the only module with a runtime classpath spanning all the others, and per
observed convention, the only module containing any tests at all. In a flat
project, a conventional location is `src/main/java/<group>/<artifact>/usecase/UseCase.java`.
The package does not matter — the plugin resolves the annotation by short name
— but the annotation must have exactly this shape:

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
void register_guest_with_valid_data() { ...}

@Test
@UseCase(id = "UC-001", scenario = "A1: Email Already Exists")
void registration_fails_when_email_already_exists() { ...}
```

## Where Tests Live in a Hexagonal Multi-Module Project

- **Integration tests** (RestAssured or MockMvc, exercising the full
  controller → service → repository → database stack) go in the
  **composition-root module** (e.g. `*-app`) — the only module where every
  layer is on the classpath.
- **`@DataJpaTest`** on a Spring Data query method must live in the
  **persistence-adapter module** (e.g. `*-postgres`) instead — that's the only
  module with the JPA/Spring Data classpath. This is a necessary consequence
  of where the repository interface lives, not a stylistic deviation from
  "only the app module has tests" — if this will be the first test file in
  that module, say so.

## DO NOT

- Mock the repository or service layer with Mockito — exercise the real
  controller → service → repository → database stack
- Use `@MockBean`/`@MockitoBean` on anything in the use case's own call chain
- Autowire the JPA repository directly into an HTTP-level integration test to
  **arrange** test data (a read-only verification assertion confirming a side
  effect the API response doesn't expose is fine; using it to set up
  preconditions is not — arrange via `JdbcTemplate`, Flyway, or the API itself)
- Delete all data in cleanup (only remove data created during the test)
- Assert on the JPA `@Entity` directly when the controller returns a DTO —
  assert on the response body / DTO shape actually returned over the wire
- Switch an existing project's established test convention (MockMvc ↔
  RestAssured) because this skill has its own default preference

## Convention A: RestAssured + Testcontainers

Test data is seeded via `JdbcTemplate` or the API itself against the **real**
Flyway migrations run automatically when the container starts — there is no
separate test-only migration file in this convention.

```java

@Testcontainers
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("integration-test")
abstract class IntegrationTestBase {

    @Container
    protected static final PostgreSQLContainer<?> postgresContainer =
            new PostgreSQLContainer<>("postgres:17-alpine");

    @DynamicPropertySource
    static void dataSourceProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgresContainer::getJdbcUrl);
        registry.add("spring.datasource.username", postgresContainer::getUsername);
        registry.add("spring.datasource.password", postgresContainer::getPassword);
    }

    @LocalServerPort
    private int port;

    @BeforeEach
    void setUpRestAssured() {
        RestAssured.port = port;
        RestAssured.basePath = "/";
    }
}
```

```java
class RoomTypeIntegrationTest extends IntegrationTestBase {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    @UseCase(id = "UC-001")
    void lists_all_room_types() {
        given()
                .when().get("/api/room-types")
                .then().statusCode(200)
                .body("[0].name", equalTo("Deluxe Suite"));
    }

    @AfterEach
    void cleanUp() {
        JdbcTestUtils.deleteFromTables(jdbcTemplate, "room_type");
    }
}
```

## Convention B: MockMvc

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

In this convention, test data is created using Flyway migrations in
`src/test/resources/db/migration` — the same approach as
`aiup-react-vite-jpa`'s `spring-boot-test` skill. Don't let this seed-file
convention leak into Convention A, and don't let Convention A's
`JdbcTemplate`/API seeding leak into this one.

## Assertions Reference

| Assertion Type    | Convention A (RestAssured)               | Convention B (MockMvc)                                 |
|-------------------|------------------------------------------|--------------------------------------------------------|
| HTTP status       | `.then().statusCode(200)`                | `.andExpect(status().isOk())`                          |
| JSON field value  | `.body("name", equalTo("Deluxe Suite"))` | `.andExpect(jsonPath("$.name").value("Deluxe Suite"))` |
| JSON array size   | `.body("size()", is(3))`                 | `.andExpect(jsonPath("$", hasSize(3)))`                |
| Repository result | `assertThat(result).hasSize(3)`          | `assertThat(result).hasSize(3)`                        |

## Workflow

1. Detect the existing test convention (Step 0)
2. Read the use case specification (`docs/use-cases/UC-XXX-*.md`) to identify
   the main success scenario, alternative flows (A1, A2, …), and referenced
   business rules (BR-XXX)
3. Check whether a `UseCase` annotation type already exists in the project. If
   not, create `UseCase.java` with the canonical shape shown above, in the
   correct module for the detected layout
4. Create the test class named `UC<id><PascalCaseUseCaseName>Test`, in the
   correct module for the detected layout
5. For each test method:
    - Annotate with `@UseCase(id = "UC-XXX", scenario = "…", businessRules = {"BR-…"})`
      mirroring the spec headings
    - Drive the request through the detected convention's HTTP client
    - Assert outcomes with AssertJ / RestAssured `.body(...)` or MockMvc `jsonPath`
    - Clean up test data if created during the test, via the detected
      convention's own approach
6. Run the tests to verify they pass
7. If a test fails:
    - Confirm the correct convention was actually followed (not mixed)
    - For Convention A, confirm the Testcontainers Postgres instance actually
      started and Flyway migrated it
    - For Convention B, verify the Flyway test migration seeded the expected rows
    - Verify the JSON path/field matches the DTO's actual field names (not the
      entity's)

## Resources

- Spring Boot Testing documentation: https://docs.spring.io/spring-boot/reference/testing/index.html
- Testcontainers documentation: https://testcontainers.com/guides/testing-spring-boot-rest-api-using-testcontainers/
- RestAssured documentation: https://rest-assured.io/
- MockMvc reference: https://docs.spring.io/spring-framework/reference/testing/spring-mvc-test-framework.html
- AIUP IntelliJ Navigator plugin (defines the `@UseCase` annotation
  contract): https://github.com/AI-Unified-Process/intellij-plugin
- If configured, use the JavaDocs MCP server for additional API lookups (`https://www.javadocs.dev/mcp`)
