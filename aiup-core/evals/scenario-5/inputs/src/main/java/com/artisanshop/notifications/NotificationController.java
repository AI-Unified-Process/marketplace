package com.artisanshop.notifications;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @GetMapping
    @PreAuthorize("hasAnyRole('BUYER', 'ARTISAN', 'ADMIN')")
    public ResponseEntity<?> listNotifications(@RequestParam(defaultValue = "false") boolean unreadOnly) {
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/read")
    @PreAuthorize("hasAnyRole('BUYER', 'ARTISAN', 'ADMIN')")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        return ResponseEntity.ok().build();
    }

    @PutMapping("/read-all")
    @PreAuthorize("hasAnyRole('BUYER', 'ARTISAN', 'ADMIN')")
    public ResponseEntity<?> markAllAsRead() {
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('BUYER', 'ARTISAN', 'ADMIN')")
    public ResponseEntity<?> deleteNotification(@PathVariable Long id) {
        return ResponseEntity.ok().build();
    }

    @GetMapping("/preferences")
    @PreAuthorize("hasAnyRole('BUYER', 'ARTISAN', 'ADMIN')")
    public ResponseEntity<?> getNotificationPreferences() {
        return ResponseEntity.ok().build();
    }

    @PutMapping("/preferences")
    @PreAuthorize("hasAnyRole('BUYER', 'ARTISAN', 'ADMIN')")
    public ResponseEntity<?> updateNotificationPreferences(@RequestBody NotificationPrefsRequest request) {
        return ResponseEntity.ok().build();
    }
}
