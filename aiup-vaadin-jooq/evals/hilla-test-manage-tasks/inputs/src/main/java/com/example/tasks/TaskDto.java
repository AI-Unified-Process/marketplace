package com.example.tasks;

import jakarta.validation.constraints.NotBlank;
import org.jspecify.annotations.Nullable;

import java.time.LocalDate;

public record TaskDto(
        @Nullable Long id,
        @NotBlank String title,
        @Nullable LocalDate dueDate,
        boolean done) {
}
