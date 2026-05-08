---
name: implement-ui
description: >
  Implements Compose Multiplatform screens and wires them to the Ktor backend
  via Ktor Client using shared @Serializable DTOs. Use when the user asks to
  "implement the UI", "create a screen", "build the Compose view", "wire the
  frontend", or mentions Compose Multiplatform screen, UI implementation,
  client-side development, or frontend for a use case.
---

# Implement Use Case (UI)

## Instructions

Implement the Compose Multiplatform UI for use case $ARGUMENTS using:
- Compose Multiplatform screens with Material 3 components
- Ktor Client for API calls to the backend
- Shared `@Serializable` DTOs from `commonMain`
- Koin for dependency injection

Don't create tests -- there is the `compose-test` skill for that.
Don't create backend code -- there is the `implement` skill for that.

## Prerequisites

The backend must be implemented first (shared DTOs, Ktor routes, Exposed repositories).
The `@Serializable` DTOs in `commonMain` must exist before building the UI.

## DO NOT

- Create test classes (use `compose-test` instead)
- Create backend code (use `implement` instead)
- Duplicate DTO definitions (import from `commonMain`)
- Use platform-specific APIs without `expect`/`actual` declarations
- Block the UI thread with synchronous network calls
- Use `runBlocking` in composables (use `LaunchedEffect` or ViewModel coroutine scopes)

## Architecture Layers

```
commonMain/
  └── model/              # @Serializable DTOs (already created by /implement)
      └── PersonDto.kt

UI module (composeApp / shared):
  ├── data/
  │   └── PersonApiClient.kt    # Ktor Client calls
  ├── ui/
  │   ├── PersonListScreen.kt   # List/overview screen
  │   └── PersonDetailScreen.kt # Detail/edit screen
  └── di/
      └── UiModule.kt           # Koin module for UI dependencies
```

> **Note:** The actual package/directory structure must be discovered from the existing project.
> The above is a reference pattern -- always follow existing conventions.

## API Client Pattern

```kotlin
// In the UI module (commonMain or composeApp)
class PersonApiClient(private val httpClient: HttpClient) {
    suspend fun getAll(): List<PersonDto> =
        httpClient.get("/api/persons").body()

    suspend fun getById(id: Long): PersonDto =
        httpClient.get("/api/persons/$id").body()

    suspend fun create(dto: PersonDto): PersonDto =
        httpClient.post("/api/persons") {
            contentType(ContentType.Application.Json)
            setBody(dto)
        }.body()

    suspend fun update(id: Long, dto: PersonDto): PersonDto =
        httpClient.put("/api/persons/$id") {
            contentType(ContentType.Application.Json)
            setBody(dto)
        }.body()

    suspend fun delete(id: Long) {
        httpClient.delete("/api/persons/$id")
    }
}
```

## Compose Screen Patterns

### List Screen

```kotlin
@Composable
fun PersonListScreen(
    onPersonClick: (Long) -> Unit,
    onAddClick: () -> Unit
) {
    val apiClient = koinInject<PersonApiClient>()
    var persons by remember { mutableStateOf<List<PersonDto>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }
    var error by remember { mutableStateOf<String?>(null) }

    LaunchedEffect(Unit) {
        try {
            persons = apiClient.getAll()
        } catch (e: Exception) {
            error = e.message
        } finally {
            isLoading = false
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(title = { Text("Persons") })
        },
        floatingActionButton = {
            FloatingActionButton(onClick = onAddClick) {
                Icon(Icons.Default.Add, contentDescription = "Add Person")
            }
        }
    ) { padding ->
        when {
            isLoading -> {
                Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    CircularProgressIndicator()
                }
            }
            error != null -> {
                Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    Text("Error: $error", color = MaterialTheme.colorScheme.error)
                }
            }
            else -> {
                LazyColumn(contentPadding = padding) {
                    items(persons, key = { it.id!! }) { person ->
                        PersonListItem(
                            person = person,
                            onClick = { onPersonClick(person.id!!) }
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun PersonListItem(person: PersonDto, onClick: () -> Unit) {
    ListItem(
        headlineContent = { Text("${person.firstName} ${person.lastName}") },
        supportingContent = { Text(person.email) },
        modifier = Modifier.clickable(onClick = onClick)
    )
}
```

### Detail/Edit Screen

```kotlin
@Composable
fun PersonDetailScreen(
    personId: Long?,
    onNavigateBack: () -> Unit
) {
    val apiClient = koinInject<PersonApiClient>()
    var firstName by remember { mutableStateOf("") }
    var lastName by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var isSaving by remember { mutableStateOf(false) }
    val snackbarHostState = remember { SnackbarHostState() }
    val scope = rememberCoroutineScope()

    LaunchedEffect(personId) {
        if (personId != null) {
            val person = apiClient.getById(personId)
            firstName = person.firstName
            lastName = person.lastName
            email = person.email
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(if (personId == null) "New Person" else "Edit Person") },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        },
        snackbarHost = { SnackbarHost(snackbarHostState) }
    ) { padding ->
        Column(
            modifier = Modifier
                .padding(padding)
                .padding(16.dp)
                .fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            OutlinedTextField(
                value = firstName,
                onValueChange = { firstName = it },
                label = { Text("First Name") },
                modifier = Modifier.fillMaxWidth()
            )
            OutlinedTextField(
                value = lastName,
                onValueChange = { lastName = it },
                label = { Text("Last Name") },
                modifier = Modifier.fillMaxWidth()
            )
            OutlinedTextField(
                value = email,
                onValueChange = { email = it },
                label = { Text("Email") },
                modifier = Modifier.fillMaxWidth()
            )
            Button(
                onClick = {
                    scope.launch {
                        isSaving = true
                        try {
                            val dto = PersonDto(
                                id = personId,
                                firstName = firstName,
                                lastName = lastName,
                                email = email
                            )
                            if (personId == null) {
                                apiClient.create(dto)
                            } else {
                                apiClient.update(personId, dto)
                            }
                            onNavigateBack()
                        } catch (e: Exception) {
                            snackbarHostState.showSnackbar("Error: ${e.message}")
                        } finally {
                            isSaving = false
                        }
                    }
                },
                enabled = !isSaving,
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(if (isSaving) "Saving..." else "Save")
            }
        }
    }
}
```

## Koin Module Pattern

```kotlin
val uiModule = module {
    single {
        HttpClient {
            install(ContentNegotiation) {
                json(Json {
                    ignoreUnknownKeys = true
                    isLenient = true
                })
            }
            defaultRequest {
                url("http://localhost:8080")
            }
        }
    }
    single { PersonApiClient(get()) }
}
```

## Build Tool Discovery

- Check for `.mise.toml` in the project root. If present, use `mise run build` (or the equivalent task name).
- If no mise configuration exists, fall back to `./gradlew build`.

## Workflow

1. Read the use case specification from `docs/use_cases/`
2. Verify the shared DTOs exist in `commonMain` (if not, run `/implement` first)
3. Check existing UI code for patterns, navigation setup, and conventions
4. Implement the Ktor Client API class
5. Implement the Compose screens following Material 3 patterns
6. Register the Koin module
7. Wire screens into the navigation graph
8. Verify the implementation compiles across all targets

## Resources

- Use the KotlinDocs MCP server for Compose Multiplatform and Ktor Client API reference
