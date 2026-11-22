package com.grandhotel.reservations;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.web.bind.annotation.*;

/** Room inventory and prices, maintained by the hotel manager. */
@RestController
@RequestMapping("/api/admin")
public class RoomAdminController {

    private final JdbcClient jdbc;

    public RoomAdminController(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    @GetMapping("/room-types")
    public List<Map<String, Object>> roomTypes() {
        return jdbc.sql("SELECT * FROM room_type ORDER BY code").query().listOfRows();
    }

    @PostMapping("/room-types")
    public void createRoomType(@Valid @RequestBody RoomType t) {
        jdbc.sql("INSERT INTO room_type (code, name, max_guests, description) VALUES (?, ?, ?, ?)")
                .params(t.code(), t.name(), t.maxGuests(), t.description()).update();
    }

    @PutMapping("/room-types/{id}")
    public void updateRoomType(@PathVariable long id, @Valid @RequestBody RoomType t) {
        jdbc.sql("UPDATE room_type SET code = ?, name = ?, max_guests = ?, description = ? WHERE id = ?")
                .params(t.code(), t.name(), t.maxGuests(), t.description(), id).update();
    }

    @GetMapping("/rooms")
    public List<Map<String, Object>> rooms() {
        return jdbc.sql("SELECT * FROM room ORDER BY number").query().listOfRows();
    }

    @PostMapping("/rooms")
    public void createRoom(@Valid @RequestBody Room r) {
        jdbc.sql("INSERT INTO room (room_type_id, number, floor) VALUES (?, ?, ?)")
                .params(r.roomTypeId(), r.number(), r.floor()).update();
    }

    @DeleteMapping("/rooms/{id}")
    public void deleteRoom(@PathVariable long id) {
        jdbc.sql("DELETE FROM room WHERE id = ?").param(id).update();
    }

    @PostMapping("/rate-plans")
    public void createRatePlan(@Valid @RequestBody RatePlan p) {
        jdbc.sql("""
                        INSERT INTO rate_plan (room_type_id, name, price_per_night, refundable, valid_from, valid_to)
                        VALUES (?, ?, ?, ?, ?, ?)""")
                .params(p.roomTypeId(), p.name(), p.pricePerNight(), p.refundable(), p.validFrom(), p.validTo())
                .update();
    }

    @PutMapping("/rate-plans/{id}")
    public void updateRatePlan(@PathVariable long id, @Valid @RequestBody RatePlan p) {
        jdbc.sql("UPDATE rate_plan SET name = ?, price_per_night = ?, refundable = ?, valid_from = ?, valid_to = ? "
                        + "WHERE id = ?")
                .params(p.name(), p.pricePerNight(), p.refundable(), p.validFrom(), p.validTo(), id).update();
    }

    public record RoomType(@NotBlank @Size(max = 10) String code, @NotBlank String name,
                           @Min(1) @Max(6) int maxGuests, String description) {
    }

    public record Room(long roomTypeId, @NotBlank @Size(max = 5) String number, int floor) {
    }

    public record RatePlan(long roomTypeId, @NotBlank String name, @DecimalMin("0") BigDecimal pricePerNight,
                           boolean refundable, LocalDate validFrom, LocalDate validTo) {
    }
}
