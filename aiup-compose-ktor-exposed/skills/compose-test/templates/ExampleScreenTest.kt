package com.example.app.ui

import com.example.app.model.PersonDto
import io.kotest.matchers.shouldBe
import androidx.compose.ui.test.ExperimentalTestApi
import androidx.compose.ui.test.assertIsDisplayed
import androidx.compose.ui.test.assertIsEnabled
import androidx.compose.ui.test.assertIsNotEnabled
import androidx.compose.ui.test.onAllNodesWithText
import androidx.compose.ui.test.onNodeWithContentDescription
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.performClick
import androidx.compose.ui.test.performTextInput
import androidx.compose.ui.test.runComposeUiTest
import kotlin.test.Test

@OptIn(ExperimentalTestApi::class)
class ExampleScreenTest {

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

        waitUntil(timeoutMillis = 5000) {
            onAllNodesWithText("Eula").fetchSemanticsNodes().isNotEmpty()
        }

        onNodeWithText("Eula Lane").assertIsDisplayed()
        onNodeWithText("John Doe").assertIsDisplayed()
    }

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

        waitUntil(timeoutMillis = 5000) {
            onAllNodesWithText("Eula").fetchSemanticsNodes().isNotEmpty()
        }

        onNodeWithText("Eula Lane").performClick()

        navigatedToId shouldBe 1L
    }

    @Test
    fun add_button_triggers_callback() = runComposeUiTest {
        var addClicked = false

        setContent {
            PersonListScreen(
                apiClient = fakeClient,
                onPersonClick = {},
                onAddClick = { addClicked = true }
            )
        }

        onNodeWithContentDescription("Add Person").performClick()

        addClicked shouldBe true
    }

    @Test
    fun form_saves_new_person() = runComposeUiTest {
        var navigatedBack = false

        setContent {
            PersonDetailScreen(
                personId = null,
                onNavigateBack = { navigatedBack = true }
            )
        }

        onNodeWithText("First Name").performTextInput("Jane")
        onNodeWithText("Last Name").performTextInput("Smith")
        onNodeWithText("Email").performTextInput("jane@example.com")

        onNodeWithText("Save").performClick()

        waitUntil(timeoutMillis = 5000) { navigatedBack }

        navigatedBack shouldBe true
    }

    // -- Fake API Client -------------------------------------------------------

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
}
