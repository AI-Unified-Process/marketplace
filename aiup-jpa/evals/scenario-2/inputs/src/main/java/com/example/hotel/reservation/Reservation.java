package com.example.hotel.reservation;

import com.example.hotel.guest.Guest;
import com.example.hotel.roomtype.RoomType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Version;

import java.time.LocalDate;

@Entity
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "reservation_seq")
    @SequenceGenerator(name = "reservation_seq", sequenceName = "reservation_seq", allocationSize = 1)
    private Long id;

    @Version
    private int version;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Guest guest;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private RoomType roomType;

    private LocalDate arrivalDate;
    private LocalDate departureDate;

    @Enumerated(EnumType.STRING)
    private ReservationStatus status;

    protected Reservation() {
    }

    public Reservation(Guest guest, RoomType roomType, LocalDate arrivalDate, LocalDate departureDate) {
        this.guest = guest;
        this.roomType = roomType;
        this.arrivalDate = arrivalDate;
        this.departureDate = departureDate;
        this.status = ReservationStatus.CONFIRMED;
    }

    public Long getId() {
        return id;
    }

    public int getVersion() {
        return version;
    }

    public Guest getGuest() {
        return guest;
    }

    public RoomType getRoomType() {
        return roomType;
    }

    public LocalDate getArrivalDate() {
        return arrivalDate;
    }

    public LocalDate getDepartureDate() {
        return departureDate;
    }

    public ReservationStatus getStatus() {
        return status;
    }
}
