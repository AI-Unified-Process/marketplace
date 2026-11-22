package com.example.hotel.roomtype;

import com.example.hotel.IntegrationTestBase;
import com.example.hotel.usecase.UseCase;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.jdbc.JdbcTestUtils;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;

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
