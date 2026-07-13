package com.example.hotel.postgres.roomtype;

import com.example.hotel.business.roomtype.RoomTypeRepository;
import com.example.hotel.domain.roomtype.RoomType;
import com.example.hotel.postgres.roomtype.converter.RoomTypeConverter;
import com.example.hotel.postgres.roomtype.converter.RoomTypeEntityConverter;
import com.example.hotel.postgres.roomtype.query.RoomTypeJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class RoomTypeRepositoryImpl implements RoomTypeRepository {

    private final RoomTypeJpaRepository jpaRepository;

    @Override
    public List<RoomType> findAll() {
        return jpaRepository.findAll().stream().map(RoomTypeConverter::toDomain).toList();
    }

    @Override
    public RoomType save(RoomType roomType) {
        var saved = jpaRepository.save(RoomTypeEntityConverter.toEntity(roomType));
        return RoomTypeConverter.toDomain(saved);
    }
}
