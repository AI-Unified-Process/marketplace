package com.example.hotel.guest;

import com.example.hotel.TestcontainersConfiguration;
import com.example.hotel.usecase.UseCase;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Import(TestcontainersConfiguration.class)
class UC002ListGuestsApiTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @UseCase(id = "UC-002")
    void lists_the_seeded_guests() throws Exception {
        mockMvc.perform(get("/api/v1/guests"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].email").value("alice@example.com"));
    }
}
