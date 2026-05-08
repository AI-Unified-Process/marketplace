package com.example.app.routes

import com.example.app.model.PersonDto
import com.example.app.plugins.configureDI
import com.example.app.plugins.configureRouting
import com.example.app.plugins.configureSerialization
import io.kotest.matchers.collections.shouldHaveSize
import io.kotest.matchers.collections.shouldNotBeEmpty
import io.kotest.matchers.nulls.shouldNotBeNull
import io.kotest.matchers.shouldBe
import io.ktor.client.call.body
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.request.accept
import io.ktor.client.request.delete
import io.ktor.client.request.get
import io.ktor.client.request.post
import io.ktor.client.request.put
import io.ktor.client.request.setBody
import io.ktor.http.ContentType
import io.ktor.http.HttpStatusCode
import io.ktor.http.contentType
import io.ktor.serialization.kotlinx.json.json
import io.ktor.server.testing.ApplicationTestBuilder
import io.ktor.server.testing.testApplication
import kotlinx.serialization.json.Json
import kotlin.test.AfterTest
import kotlin.test.Test

class ExampleRouteTest {

    private fun ApplicationTestBuilder.jsonClient() = createClient {
        install(ContentNegotiation) {
            json(Json {
                ignoreUnknownKeys = true
                isLenient = true
            })
        }
    }

    @Test
    fun `GET persons returns list`() = testApplication {
        application {
            configureSerialization()
            configureDI()
            configureRouting()
        }
        val client = jsonClient()

        val response = client.get("/api/persons") {
            accept(ContentType.Application.Json)
        }

        response.status shouldBe HttpStatusCode.OK
        val persons = response.body<List<PersonDto>>()
        persons.shouldNotBeEmpty()
    }

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

    @Test
    fun `POST creates new person and returns 201`() = testApplication {
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

    @Test
    fun `DELETE person returns 204`() = testApplication {
        application {
            configureSerialization()
            configureDI()
            configureRouting()
        }
        val client = jsonClient()

        val response = client.delete("/api/persons/1")

        response.status shouldBe HttpStatusCode.NoContent
    }

    @AfterTest
    fun cleanup() {
        // Remove test-created data here if needed
    }
}
