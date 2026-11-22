package com.artisanshop.orders;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @PostMapping
    @PreAuthorize("hasRole('BUYER')")
    public ResponseEntity<?> placeOrder(@RequestBody PlaceOrderRequest request) {
        return ResponseEntity.ok().build();
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('BUYER', 'ARTISAN')")
    public ResponseEntity<?> listOrders(@RequestParam(required = false) String status) {
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('BUYER', 'ARTISAN', 'ADMIN')")
    public ResponseEntity<?> getOrder(@PathVariable Long id) {
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasRole('BUYER')")
    public ResponseEntity<?> cancelOrder(@PathVariable Long id) {
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/ship")
    @PreAuthorize("hasRole('ARTISAN')")
    public ResponseEntity<?> markOrderShipped(@PathVariable Long id,
                                              @RequestBody ShipOrderRequest request) {
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/deliver")
    @PreAuthorize("hasRole('ARTISAN')")
    public ResponseEntity<?> markOrderDelivered(@PathVariable Long id) {
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/review")
    @PreAuthorize("hasRole('BUYER')")
    public ResponseEntity<?> submitReview(@PathVariable Long id,
                                          @RequestBody ReviewRequest request) {
        return ResponseEntity.ok().build();
    }
}
