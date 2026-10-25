package com.grandhotel.reservations;

import java.time.LocalDate;
import java.util.List;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AvailabilityController {

    private final ReservationService reservations;

    public AvailabilityController(ReservationService reservations) {
        this.reservations = reservations;
    }

    @GetMapping("/api/availability")
    public List<ReservationService.Offer> offers(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate arrival,
                                                 @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate departure,
                                                 @RequestParam int adults) {
        return reservations.offers(arrival, departure, adults);
    }
}
