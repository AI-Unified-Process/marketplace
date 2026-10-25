package com.example.workshops.workshop;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/workshops")
public class WorkshopController {

    private final WorkshopService workshopService;

    public WorkshopController(WorkshopService workshopService) {
        this.workshopService = workshopService;
    }

    /** UC-001 steps 1–2. */
    @GetMapping
    public List<Workshop> list() {
        return workshopService.findAll();
    }

    /** UC-001 steps 3–5. */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Workshop create(@RequestBody Workshop workshop) {
        return workshopService.save(workshop);
    }
}
