package com.artisanshop.admin;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/products")
@PreAuthorize("hasRole('ADMIN')")
public class AdminProductController {

    @GetMapping("/pending")
    public ResponseEntity<?> listPendingApprovals() {
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveProduct(@PathVariable Long id) {
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectProduct(@PathVariable Long id,
                                           @RequestBody RejectProductRequest request) {
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/feature")
    public ResponseEntity<?> featureProduct(@PathVariable Long id) {
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> removeProduct(@PathVariable Long id) {
        return ResponseEntity.ok().build();
    }
}
