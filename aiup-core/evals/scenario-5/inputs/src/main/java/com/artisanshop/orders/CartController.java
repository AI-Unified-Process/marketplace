package com.artisanshop.orders;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @GetMapping
    @PreAuthorize("hasRole('BUYER')")
    public ResponseEntity<?> getCart() {
        return ResponseEntity.ok().build();
    }

    @PostMapping("/items")
    @PreAuthorize("hasRole('BUYER')")
    public ResponseEntity<?> addItem(@RequestBody AddCartItemRequest request) {
        return ResponseEntity.ok().build();
    }

    @PutMapping("/items/{itemId}")
    @PreAuthorize("hasRole('BUYER')")
    public ResponseEntity<?> updateItemQuantity(@PathVariable Long itemId,
                                                @RequestBody UpdateQuantityRequest request) {
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/items/{itemId}")
    @PreAuthorize("hasRole('BUYER')")
    public ResponseEntity<?> removeItem(@PathVariable Long itemId) {
        return ResponseEntity.ok().build();
    }

    @DeleteMapping
    @PreAuthorize("hasRole('BUYER')")
    public ResponseEntity<?> clearCart() {
        return ResponseEntity.ok().build();
    }
}
