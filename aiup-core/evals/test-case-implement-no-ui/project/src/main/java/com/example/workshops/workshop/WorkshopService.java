package com.example.workshops.workshop;

import java.time.Clock;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class WorkshopService {

    private final WorkshopRepository workshopRepository;
    private final Clock clock;

    public WorkshopService(WorkshopRepository workshopRepository, Clock clock) {
        this.workshopRepository = workshopRepository;
        this.clock = clock;
    }

    /** UC-001 steps 1–2: all workshops ordered by start time. */
    @Transactional(readOnly = true)
    public List<Workshop> findAll() {
        return workshopRepository.findAll();
    }

    /** UC-001 steps 3–5 and A1: creates or changes a workshop. */
    @Transactional
    public Workshop save(Workshop workshop) {
        // UC-001 BR-001: A workshop must start in the future when it is saved.
        if (!workshop.startsAt().isAfter(LocalDateTime.now(clock))) {
            throw new WorkshopInPastException("A workshop must start in the future.");
        }
        if (workshop.id() == null) {
            long id = workshopRepository.insert(workshop);
            return workshopRepository.findById(id).orElseThrow();
        }
        workshopRepository.update(workshop);
        return workshop;
    }
}
