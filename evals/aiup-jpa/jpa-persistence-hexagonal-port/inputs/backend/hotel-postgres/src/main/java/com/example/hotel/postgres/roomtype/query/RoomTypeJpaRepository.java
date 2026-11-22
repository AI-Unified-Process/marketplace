package com.example.hotel.postgres.roomtype.query;

import com.example.hotel.postgres.roomtype.model.RoomTypeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomTypeJpaRepository extends JpaRepository<RoomTypeEntity, Long> {
}
