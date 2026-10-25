package com.artisanshop.users;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok().build();
    }

    @GetMapping("/profile")
    @PreAuthorize("hasAnyRole('BUYER', 'ARTISAN', 'ADMIN')")
    public ResponseEntity<?> getProfile() {
        return ResponseEntity.ok().build();
    }

    @PutMapping("/profile")
    @PreAuthorize("hasAnyRole('BUYER', 'ARTISAN', 'ADMIN')")
    public ResponseEntity<?> updateProfile(@RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok().build();
    }

    @PutMapping("/change-password")
    @PreAuthorize("hasAnyRole('BUYER', 'ARTISAN', 'ADMIN')")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {
        return ResponseEntity.ok().build();
    }

    @GetMapping("/artisan/{id}")
    public ResponseEntity<?> getArtisanPublicProfile(@PathVariable Long id) {
        return ResponseEntity.ok().build();
    }

    @GetMapping("/artisan/{id}/reviews")
    public ResponseEntity<?> getArtisanReviews(@PathVariable Long id) {
        return ResponseEntity.ok().build();
    }
}
