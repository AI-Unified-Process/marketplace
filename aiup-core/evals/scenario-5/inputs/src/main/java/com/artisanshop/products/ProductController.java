package com.artisanshop.products;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @GetMapping
    public ResponseEntity<?> listProducts(@RequestParam(required = false) Long categoryId,
                                          @RequestParam(required = false) String search,
                                          @RequestParam(defaultValue = "0") int page) {
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProduct(@PathVariable Long id) {
        return ResponseEntity.ok().build();
    }

    @PostMapping
    @PreAuthorize("hasRole('ARTISAN')")
    public ResponseEntity<?> createProduct(@RequestBody CreateProductRequest request) {
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ARTISAN')")
    public ResponseEntity<?> updateProduct(@PathVariable Long id,
                                           @RequestBody UpdateProductRequest request) {
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ARTISAN')")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/images")
    @PreAuthorize("hasRole('ARTISAN')")
    public ResponseEntity<?> uploadProductImage(@PathVariable Long id) {
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/reviews")
    public ResponseEntity<?> getProductReviews(@PathVariable Long id) {
        return ResponseEntity.ok().build();
    }
}
