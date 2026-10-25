package com.example.hotel.roomtype;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;

import java.math.BigDecimal;

@Entity
public class RoomType {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "room_type_seq")
    @SequenceGenerator(name = "room_type_seq", sequenceName = "room_type_seq", allocationSize = 1)
    private Long id;

    private String name;
    private int capacity;
    private BigDecimal price;

    protected RoomType() {
    }

    public RoomType(String name, int capacity, BigDecimal price) {
        this.name = name;
        this.capacity = capacity;
        this.price = price;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public int getCapacity() {
        return capacity;
    }

    public BigDecimal getPrice() {
        return price;
    }
}
