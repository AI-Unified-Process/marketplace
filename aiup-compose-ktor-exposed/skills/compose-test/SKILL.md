---
name: compose-test
description: >
  Creates Compose Multiplatform UI tests using runComposeUiTest with
  semantics-based assertions covering screen rendering, user interactions,
  form validation, navigation, and state management. Use when the user asks
  to "write Compose tests", "test the UI", "create screen tests", "unit test
  a Compose screen", or mentions Compose testing, UI testing,
  runComposeUiTest, semantics testing, or Compose assertions.
---

# Compose Test

## Instructions

Create Compose Multiplatform UI tests for use case $ARGUMENTS using:
- `runComposeUiTest {}` for in-process UI testing (no device or emulator needed)
- Semantics-based node finders (`onNodeWithText`, `onNodeWithContentDescription`)
- kotlin.test for test annotations
- Kotest assertions where applicable

## DO NOT

- Use Android-specific `createComposeRule()` (use `runComposeUiTest` for multiplatform)
- Use `Thread.sleep()` or explicit delays (use `waitUntil {}` for async operations)
- Make real network calls (provide fake/stub API clients)
- Test implementation details (test behavior through the semantics tree)
- Use `onNodeWithTag` as the primary finder (prefer text and content description for accessibility)

## Test Data Strategy

Provide fake API clients that return predefined data. Do not call real backends.

```kotlin
class FakePersonApiClient : PersonApiClient {
    val persons = mutableListOf(
        PersonDto(id = 1, firstName = "Eula", lastName = "Lane", email = "eula@example.com"),
        PersonDto(id = 2, firstName = "John", lastName = "Doe", email = "john@example.com")
    )

    override suspend fun getAll(): List<PersonDto> = persons
    override suspend fun getById(id: Long): PersonDto = persons.first { it.id == id }
    override suspend fun create(dto: PersonDto): PersonDto = dto.copy(id = 3)
    override suspend fun update(id: Long, dto: PersonDto): PersonDto = dto.copy(id = id)
    override suspend fun delete(id: Long) { persons.removeAll { it.id == id } }
}
```

## Template

Use [templates/ExampleScreenTest.kt](templates/ExampleScreenTest.kt) as the test class structure.

## Common Patterns

### Basic Test Setup

```kotlin
class PersonListScreenTest {

    private val fakeClient = FakePersonApiClient()

    @Test
    fun screen_displays_persons() = runComposeUiTest {
        setContent {
            PersonListScreen(
                apiClient = fakeClient,
                onPersonClick = {},
                onAddClick = {}
            )
        }

        onNodeWithText("Eula Lane").assertIsDisplayed()
        onNodeWithText("John Doe").assertIsDisplayed()
    }
}
```

### Finding Nodes

```kotlin
// By visible text
onNodeWithText("Save").assertIsDisplayed()
onNodeWithText("Eula", substring = true).assertExists()

// By content description (icons, image buttons)
onNodeWithContentDescription("Add Person").assertIsDisplayed()
onNodeWithContentDescription("Back").performClick()

// By test tag (when text/description aren't suitable)
onNodeWithTag("person-grid").assertIsDisplayed()

// Multiple matching nodes
onAllNodesWithText("Delete").assertCountEquals(2)
onAllNodesWithText("Delete")[0].performClick()
```

### User Interactions

```kotlin
// Click
onNodeWithText("Save").performClick()

// Text input
onNodeWithText("First Name").performTextInput("John")
onNodeWithText("First Name").performTextClearance()
onNodeWithText("First Name").performTextReplacement("Jane")

// Scroll
onNodeWithTag("person-list").performScrollToIndex(10)
onNodeWithText("Last Item").performScrollTo()

// Swipe
onNodeWithTag("item-1").performTouchInput { swipeLeft() }
```

### Assertions

```kotlin
// Visibility
onNodeWithText("Save").assertIsDisplayed()
onNodeWithText("Error").assertDoesNotExist()

// Enabled state
onNodeWithText("Save").assertIsEnabled()
onNodeWithText("Save").assertIsNotEnabled()

// Focus
onNodeWithText("First Name").assertIsFocused()

// Text content
onNodeWithText("First Name").assertTextEquals("First Name", "John")
onNodeWithText("First Name").assertTextContains("John")

// Selection
onNodeWithText("Active").assertIsOn()     // checkbox/switch
onNodeWithText("Active").assertIsOff()

// Count
onAllNodesWithText("Delete").assertCountEquals(5)
onAllNodesWithContentDescription("Star").assertCountEquals(3)
```

### Waiting for Async Operations

```kotlin
@Test
fun screen_shows_data_after_loading() = runComposeUiTest {
    setContent {
        PersonListScreen(apiClient = fakeClient, onPersonClick = {}, onAddClick = {})
    }

    // Wait for loading to complete
    waitUntil(timeoutMillis = 5000) {
        onAllNodesWithText("Eula").fetchSemanticsNodes().isNotEmpty()
    }

    onNodeWithText("Eula Lane").assertIsDisplayed()
}
```

### Testing Navigation Callbacks

```kotlin
@Test
fun clicking_person_triggers_navigation() = runComposeUiTest {
    var navigatedToId: Long? = null

    setContent {
        PersonListScreen(
            apiClient = fakeClient,
            onPersonClick = { navigatedToId = it },
            onAddClick = {}
        )
    }

    waitUntil {
        onAllNodesWithText("Eula").fetchSemanticsNodes().isNotEmpty()
    }

    onNodeWithText("Eula Lane").performClick()

    navigatedToId shouldBe 1L
}
```

### Testing Form Validation

```kotlin
@Test
fun empty_name_shows_error() = runComposeUiTest {
    setContent {
        PersonDetailScreen(personId = null, onNavigateBack = {})
    }

    // Leave name empty, click save
    onNodeWithText("Save").performClick()

    // Assert error is shown
    onNodeWithText("First name is required").assertIsDisplayed()
}
```

### Testing Snackbar / Feedback

```kotlin
@Test
fun save_success_shows_snackbar() = runComposeUiTest {
    setContent {
        PersonDetailScreen(personId = null, onNavigateBack = {})
    }

    onNodeWithText("First Name").performTextInput("John")
    onNodeWithText("Last Name").performTextInput("Doe")
    onNodeWithText("Email").performTextInput("john@example.com")
    onNodeWithText("Save").performClick()

    waitUntil {
        onAllNodesWithText("Saved successfully").fetchSemanticsNodes().isNotEmpty()
    }
    onNodeWithText("Saved successfully").assertIsDisplayed()
}
```

## Assertions Reference

| Assertion Type       | Example                                                |
|----------------------|--------------------------------------------------------|
| Displayed            | `onNodeWithText("Name").assertIsDisplayed()`           |
| Not exists           | `onNodeWithText("Error").assertDoesNotExist()`         |
| Enabled              | `onNodeWithText("Save").assertIsEnabled()`             |
| Disabled             | `onNodeWithText("Save").assertIsNotEnabled()`          |
| Text content         | `onNodeWithText("Name").assertTextContains("John")`    |
| Checkbox on          | `onNodeWithText("Active").assertIsOn()`                |
| Count                | `onAllNodesWithText("Item").assertCountEquals(3)`      |
| Callback triggered   | `navigatedToId shouldBe 1L` (Kotest)                  |

## Build Tool Discovery

- Check for `.mise.toml` in the project root. If present, use `mise run test` (or the equivalent task name).
- If no mise configuration exists, fall back to `./gradlew desktopTest` (or the appropriate test task for the UI module).

## Workflow

1. Read the use case specification
2. Use TodoWrite to create a task for each test scenario
3. Create a fake API client for the screen under test
4. Create test class using the template
5. For each test:
    - Set content with the composable under test, injecting fakes
    - Find nodes using semantics (text, content description)
    - Perform interactions (click, text input, scroll)
    - Assert expected outcomes
    - Use `waitUntil` for any async operations
6. Run tests to verify they pass
7. If a test fails:
    - Use `onRoot().printToLog("TAG")` to dump the semantics tree
    - Verify the composable is receiving the fake data correctly
    - Check that `waitUntil` timeouts are sufficient
    - Ensure text matchers are exact (use `substring = true` for partial matches)
8. Mark todos complete

## Resources

- Use the KotlinDocs MCP server for Compose testing API reference
