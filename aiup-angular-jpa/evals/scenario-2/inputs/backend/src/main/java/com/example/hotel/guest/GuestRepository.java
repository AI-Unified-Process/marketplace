package com.example.hotel.guest;

import org.springframework.data.jpa.repository.JpaRepository;

public interface GuestRepository extends JpaRepository<Guest, Long> {
    boolean existsByEmail(String email);
}
