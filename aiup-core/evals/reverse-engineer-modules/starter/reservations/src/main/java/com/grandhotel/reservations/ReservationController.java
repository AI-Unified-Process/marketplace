package com.grandhotel.reservations;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.security.Principal;
import java.time.LocalDate;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ReservationController {

    private final ReservationService reservations;
    private final FrontDeskService frontDesk;

    public ReservationController(ReservationService reservations, FrontDeskService frontDesk) {
        this.reservations = reservations;
        this.frontDesk = frontDesk;
    }

    @PostMapping("/me/reservations")
    @ResponseStatus(HttpStatus.CREATED)
    public ReservationService.Confirmation book(Principal principal, @Valid @RequestBody Booking booking) {
        return reservations.book(principal.getName(), booking);
    }

    @GetMapping("/me/reservations")
    public List<ReservationService.ReservationView> mine(Principal principal) {
        return reservations.of(principal.getName());
    }

    @PutMapping("/me/reservations/{code}")
    public ReservationService.Confirmation change(Principal principal, @PathVariable String code,
                                                  @Valid @RequestBody Booking booking) {
        return reservations.change(principal.getName(), code, booking);
    }

    @DeleteMapping("/me/reservations/{code}")
    public ReservationService.Cancellation cancel(Principal principal, @PathVariable String code) {
        return reservations.cancel(principal.getName(), code);
    }

    @GetMapping("/front-desk/arrivals")
    public List<ReservationService.ReservationView> arrivals(@RequestParam LocalDate date) {
        return frontDesk.arrivals(date);
    }

    @PostMapping("/front-desk/reservations/{code}/check-in")
    public void checkIn(@PathVariable String code, @RequestBody List<String> roomNumbers) {
        frontDesk.checkIn(code, roomNumbers);
    }

    @PostMapping("/front-desk/reservations/{code}/check-out")
    public void checkOut(@PathVariable String code) {
        frontDesk.checkOut(code);
    }

    public record Booking(@NotNull @Future LocalDate arrival, @NotNull LocalDate departure,
                          @Min(1) int adults, long ratePlanId) {
    }
}
