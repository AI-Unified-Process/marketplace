package com.artisanshop.reports;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
public class ReportController {

    @GetMapping("/sales")
    public ResponseEntity<?> getSalesReport(@RequestParam String from,
                                            @RequestParam String to) {
        return ResponseEntity.ok().build();
    }

    @GetMapping("/top-sellers")
    public ResponseEntity<?> getTopSellerReport(@RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok().build();
    }

    @GetMapping("/revenue")
    public ResponseEntity<?> getRevenueBreakdown(@RequestParam String period) {
        return ResponseEntity.ok().build();
    }

    @GetMapping("/disputes")
    public ResponseEntity<?> getDisputeReport() {
        return ResponseEntity.ok().build();
    }
}
