package com.grandhotel.housekeeping;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.security.Principal;
import java.time.LocalDate;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/housekeeping")
public class HousekeepingController {

    private final HousekeepingService housekeeping;

    public HousekeepingController(HousekeepingService housekeeping) {
        this.housekeeping = housekeeping;
    }

    @GetMapping("/board")
    @PreAuthorize("hasRole('SUPERVISOR')")
    public List<HousekeepingService.TaskView> board(@RequestParam LocalDate date) {
        return housekeeping.board(date);
    }

    @PutMapping("/tasks/{id}/assignee")
    @PreAuthorize("hasRole('SUPERVISOR')")
    public void assign(@PathVariable long id, @RequestParam long housekeeperId) {
        housekeeping.assign(id, housekeeperId);
    }

    @GetMapping("/my-tasks")
    @PreAuthorize("hasRole('HOUSEKEEPER')")
    public List<HousekeepingService.TaskView> myTasks(Principal principal) {
        return housekeeping.tasksOf(principal.getName(), LocalDate.now());
    }

    @PostMapping("/tasks/{id}/done")
    @PreAuthorize("hasRole('HOUSEKEEPER')")
    public void done(Principal principal, @PathVariable long id) {
        housekeeping.complete(principal.getName(), id);
    }

    @PostMapping("/tasks/{id}/inspection")
    @PreAuthorize("hasRole('SUPERVISOR')")
    public void inspect(Principal principal, @PathVariable long id, @Valid @RequestBody Inspection inspection) {
        housekeeping.inspect(principal.getName(), id, inspection);
    }

    @PostMapping("/maintenance")
    public void report(Principal principal, @Valid @RequestBody Defect defect) {
        housekeeping.reportDefect(principal.getName(), defect);
    }

    @PutMapping("/maintenance/{id}/resolved")
    @PreAuthorize("hasRole('SUPERVISOR')")
    public void resolve(@PathVariable long id) {
        housekeeping.resolveDefect(id);
    }

    public record Inspection(boolean passed, @Size(max = 500) String remarks) {
    }

    public record Defect(@NotBlank String roomNumber, @NotBlank @Size(max = 1000) String description,
                         @NotBlank String priority) {
    }
}
