---
name: implement
description: >
  Implements use cases by creating shared @Serializable DTOs in commonMain,
  Exposed DSL table definitions and queries for the data access layer, and
  Ktor route handlers for the REST API. Use when the user asks to "implement
  a use case", "build the backend", "create the API", "write the data access
  layer", or mentions Ktor implementation, Exposed queries, REST endpoints,
  or backend development.
---

# Implement Use Case (Backend)

## Instructions

Implement the backend for use case $ARGUMENTS using:
- Shared `@Serializable` data classes in `commonMain` for DTOs
- Exposed DSL for data access (PostgreSQL)
- Ktor route handlers for REST endpoints
- Koin for dependency injection

Don't create tests -- there are the `ktor-test` and `compose-test` skills for that.
Don't create UI screens -- there is the `implement-ui` skill for that.

## DO NOT

- Create test classes (use dedicated testing skills instead)
- Create Compose UI screens (use `implement-ui` instead)
- Use Exposed DAO style (use DSL style only)
- Use `runBlocking` inside route handlers (Ktor handlers are already suspending)
- Put server-only code in `commonMain` (Exposed tables and Ktor routes go in the server module)
- Forget `@Serializable` annotation on DTOs

## Architecture Layers

```
commonMain/
  └── model/           # @Serializable DTOs shared between client and server
      └── PersonDto.kt

server (jvmMain)/
  ├── db/              # Exposed table definitions
  │   └── PersonTable.kt
  ├── repository/      # Data access using Exposed DSL
  │   └── PersonRepository.kt
  ├── route/           # Ktor route handlers
  │   └── PersonRoutes.kt
  └── di/              # Koin module definitions
      └── PersonModule.kt
```

> **Note:** The actual package/directory structure must be discovered from the existing project.
> The above is a reference pattern — always follow existing conventions.

## Shared DTO Pattern

```kotlin
// In commonMain
@Serializable
data class PersonDto(
    val id: Long? = null,
    val firstName: String,
    val lastName: String,
    val email: String,
    val birthDate: LocalDate? = null
)
```

## Exposed Table Definition

```kotlin
// In server module
object Persons : LongIdTable("person") {
    val firstName = varchar("first_name", 100)
    val lastName = varchar("last_name", 100)
    val email = varchar("email", 255).uniqueIndex()
    val birthDate = date("birth_date").nullable()
}
```

## Repository Pattern

```kotlin
// In server module
class PersonRepository {
    suspend fun findAll(): List<PersonDto> = newSuspendedTransaction {
        Persons.selectAll().map { it.toPersonDto() }
    }

    suspend fun findById(id: Long): PersonDto? = newSuspendedTransaction {
        Persons.selectAll().where { Persons.id eq id }
            .map { it.toPersonDto() }
            .singleOrNull()
    }

    suspend fun create(dto: PersonDto): Long = newSuspendedTransaction {
        Persons.insertAndGetId {
            it[firstName] = dto.firstName
            it[lastName] = dto.lastName
            it[email] = dto.email
            it[birthDate] = dto.birthDate
        }.value
    }

    suspend fun update(id: Long, dto: PersonDto): Boolean = newSuspendedTransaction {
        Persons.update({ Persons.id eq id }) {
            it[firstName] = dto.firstName
            it[lastName] = dto.lastName
            it[email] = dto.email
            it[birthDate] = dto.birthDate
        } > 0
    }

    suspend fun delete(id: Long): Boolean = newSuspendedTransaction {
        Persons.deleteWhere { Persons.id eq id } > 0
    }

    private fun ResultRow.toPersonDto() = PersonDto(
        id = this[Persons.id].value,
        firstName = this[Persons.firstName],
        lastName = this[Persons.lastName],
        email = this[Persons.email],
        birthDate = this[Persons.birthDate]
    )
}
```

## Ktor Route Pattern

```kotlin
// In server module
fun Route.personRoutes() {
    val repository by inject<PersonRepository>()

    route("/api/persons") {
        get {
            call.respond(repository.findAll())
        }
        get("/{id}") {
            val id = call.parameters["id"]?.toLongOrNull()
                ?: return@get call.respond(HttpStatusCode.BadRequest, "Invalid ID")
            val person = repository.findById(id)
                ?: return@get call.respond(HttpStatusCode.NotFound)
            call.respond(person)
        }
        post {
            val dto = call.receive<PersonDto>()
            val id = repository.create(dto)
            call.respond(HttpStatusCode.Created, dto.copy(id = id))
        }
        put("/{id}") {
            val id = call.parameters["id"]?.toLongOrNull()
                ?: return@put call.respond(HttpStatusCode.BadRequest, "Invalid ID")
            val dto = call.receive<PersonDto>()
            if (repository.update(id, dto)) {
                call.respond(HttpStatusCode.OK, dto.copy(id = id))
            } else {
                call.respond(HttpStatusCode.NotFound)
            }
        }
        delete("/{id}") {
            val id = call.parameters["id"]?.toLongOrNull()
                ?: return@delete call.respond(HttpStatusCode.BadRequest, "Invalid ID")
            if (repository.delete(id)) {
                call.respond(HttpStatusCode.NoContent)
            } else {
                call.respond(HttpStatusCode.NotFound)
            }
        }
    }
}
```

## Koin Module Pattern

```kotlin
// In server module
val personModule = module {
    single { PersonRepository() }
}
```

## Build Tool Discovery

- Check for `.mise.toml` in the project root. If present, use `mise run build` (or the equivalent task name).
- If no mise configuration exists, fall back to `./gradlew build`.

## Workflow

1. Read the use case specification from `docs/use_cases/`
2. Read the entity model from `docs/entity_model.md`
3. Check existing code for patterns and conventions (inspect `settings.gradle.kts` for module names)
4. Create `@Serializable` DTOs in `commonMain`
5. Create Exposed table definitions in the server module (if not already present from migrations)
6. Implement the repository using Exposed DSL
7. Implement the Ktor route handlers
8. Register the Koin module
9. Wire routes into the Ktor application module
10. Verify the implementation compiles successfully

## Resources

- Use the KotlinDocs MCP server for Exposed DSL and Ktor API reference
