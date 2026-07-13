package com.example.hotel.postgres.roomtype.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "room_type")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RoomTypeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "room_type_seq")
    private Long id;

    private String name;
    private String description;
    private int capacity;
    private BigDecimal price;
}
