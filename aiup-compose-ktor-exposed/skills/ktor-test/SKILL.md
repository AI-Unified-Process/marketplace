---
name: ktor-test
description: >
  Creates Ktor server-side API tests using the testApplication DSL covering
  endpoint behavior, request validation, response status codes, JSON
  serialization, and error handling. Use when the user asks to "write API
  tests", "test the Ktor endpoints", "create backend tests", "unit test the
  routes", or mentions Ktor testing, testApplication, API testing, endpoint
  tests, or server-side testing.
---

# Ktor Test

## Instructions

Create Ktor API tests for use case $ARGUMENTS using:
- Ktor `testApplication {}` DSL for in-process testing (no real HTTP server)
- Koin test modules for dependency injection
- kotlin.test for test annotations
- Kotest assertions for expressive matchers
- Flyway test migrations for test data

## DO NOT

- Start a real HTTP server (use `testApplication {}` which runs in-process)
- Use Mockito or MockK for mocking repositories (use a real test database with Flyway)
- Use `runBlocking` in tests (Ktor test client is already suspending)
- Delete all data in cleanup (only remove data created during the test)
- Hardcode port numbers (tests run in-process, no ports needed)
- Forget to install `ContentNegotiation` in the test client

## Test Data Strategy

Create test data using Flyway migrations in `src/test/resources/db/migration`.

| Approach         | Location                               | Purpose                  |
|------------------|----------------------------------------|--------------------------|
| Flyway migration | src/test/resources/db/migration/V*.sql | Populate test data       |
| Manual cleanup   | @AfterTest function                    | Remove test-created data |

## Template

Use [templates/ExampleRouteTest.kt](templates/ExampleRouteTest.kt) as the test class structure.

## Common Patterns

### Basic Test Setup

```kotlin
class PersonRoutesTest {

    @Test
    fun `GET persons returns list`() = testApplication {
        application {
            configureSerialization()
            configureDI()
            configureRouting()
        }

        val response = client.get("/api/persons") {
            accept(ContentType.Application.Json)
        }

        response.status shouldBe HttpStatusCode.OK
        val persons = response.body<List<PersonDto>>()
        persons.shouldNotBeEmpty()
    }
}
```

### Test Client with JSON Support

```kotlin
fun ApplicationTestBuilder.jsonClient() = createClient {
    install(io.ktor.client.plugins.contentnegotiation.ContentNegotiation) {
        json(Json {
            ignoreUnknownKeys = true
            isLenient = true
        })
    }
}
```

### GET Endpoint Tests

```kotlin
@Test
fun `GET person by id returns person`() = testApplication {
    application {
        configureSerialization()
        configureDI()
        configureRouting()
    }
    val client = jsonClient()

    val response = client.get("/api/persons/1")

    response.status shouldBe HttpStatusCode.OK
    val person = response.body<PersonDto>()
    person.firstName shouldBe "Eula"
}

@Test
fun `GET person by invalid id returns 404`() = testApplication {
    application {
        configureSerialization()
        configureDI()
        configureRouting()
    }
    val client = jsonClient()

    val response = client.get("/api/persons/99999")

    response.status shouldBe HttpStatusCode.NotFound
}
```

### POST Endpoint Tests

```kotlin
@Test
fun `POST creates new person`() = testApplication {
    application {
        configureSerialization()
        configureDI()
        configureRouting()
    }
    val client = jsonClient()

    val newPerson = PersonDto(
        firstName = "John",
        lastName = "Doe",
        email = "john.doe@example.com"
    )

    val response = client.post("/api/persons") {
        contentType(ContentType.Application.Json)
        setBody(newPerson)
    }

    response.status shouldBe HttpStatusCode.Created
    val created = response.body<PersonDto>()
    created.id.shouldNotBeNull()
    created.firstName shouldBe "John"
}
```

### PUT Endpoint Tests

```kotlin
@Test
fun `PUT updates existing person`() = testApplication {
    application {
        configureSerialization()
        configureDI()
        configureRouting()
    }
    val client = jsonClient()

    val updated = PersonDto(
        firstName = "Updated",
        lastName = "Name",
        email = "updated@example.com"
    )

    val response = client.put("/api/persons/1") {
        contentType(ContentType.Application.Json)
        setBody(updated)
    }

    response.status shouldBe HttpStatusCode.OK
    val result = response.body<PersonDto>()
    result.firstName shouldBe "Updated"
}
```

### DELETE Endpoint Tests

```kotlin
@Test
fun `DELETE removes person`() = testApplication {
    application {
        configureSerialization()
        configureDI()
        configureRouting()
    }
    val client = jsonClient()

    val response = client.delete("/api/persons/1")

    response.status shouldBe HttpStatusCode.NoContent
}

@Test
fun `DELETE non-existent person returns 404`() = testApplication {
    application {
        configureSerialization()
        configureDI()
        configureRouting()
    }
    val client = jsonClient()

    val response = client.delete("/api/persons/99999")

    response.status shouldBe HttpStatusCode.NotFound
}
```

### Koin Test Module

```kotlin
fun Application.configureDI() {
    install(Koin) {
        modules(testModule)
    }
}

val testModule = module {
    single { PersonRepository() }
}
```

## Assertions Reference

Use Kotest assertions:

| Assertion Type        | Example                                      |
|-----------------------|----------------------------------------------|
| Status code           | `response.status shouldBe HttpStatusCode.OK` |
| Not null              | `person.id.shouldNotBeNull()`                |
| String equality       | `person.firstName shouldBe "John"`           |
| Collection not empty  | `persons.shouldNotBeEmpty()`                 |
| Collection size       | `persons shouldHaveSize 5`                   |
| Contains element      | `names shouldContain "John"`                 |

## Build Tool Discovery

- Check for `.mise.toml` in the project root. If present, use `mise run test` (or the equivalent task name).
- If no mise configuration exists, fall back to `./gradlew test`.

## Workflow

1. Read the use case specification
2. Use TodoWrite to create a task for each test scenario
3. Create test class using the template
4. For each test:
    - Set up `testApplication` with required modules
    - Create a JSON-enabled test client
    - Send request to the endpoint
    - Assert response status code and body
    - Clean up test data if created during test
5. Run tests to verify they pass
6. If a test fails:
    - Verify the application modules are correctly configured in the test
    - Check that test data exists in the Flyway test migrations
    - Ensure the test client has `ContentNegotiation` installed
    - Verify serialization matches between request/response and DTOs
7. Mark todos complete

## Resources

- Use the KotlinDocs MCP server for Ktor testing API reference
