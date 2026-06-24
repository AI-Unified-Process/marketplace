package com.artisanshop.admin;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    @GetMapping
    public ResponseEntity<?> listAllUsers(@RequestParam(required = false) String role,
                                          @RequestParam(defaultValue = "0") int page) {
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserDetails(@PathVariable Long id) {
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/suspend")
    public ResponseEntity<?> suspendUser(@PathVariable Long id,
                                         @RequestBody SuspendUserRequest request) {
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/reinstate")
    public ResponseEntity<?> reinstateUser(@PathVariable Long id) {
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<?> changeUserRole(@PathVariable Long id,
                                            @RequestBody ChangeRoleRequest request) {
        return ResponseEntity.ok().build();
    }
}
