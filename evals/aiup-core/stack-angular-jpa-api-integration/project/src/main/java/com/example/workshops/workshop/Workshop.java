package com.example.workshops.workshop;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;

@Entity
public class Workshop {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "workshop_seq")
    @SequenceGenerator(name = "workshop_seq", allocationSize = 1)
    private Long id;

    private String title;

    private LocalDateTime startsAt;

    private int capacity;

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public LocalDateTime getStartsAt() {
        return startsAt;
    }

    public int getCapacity() {
        return capacity;
    }
}
