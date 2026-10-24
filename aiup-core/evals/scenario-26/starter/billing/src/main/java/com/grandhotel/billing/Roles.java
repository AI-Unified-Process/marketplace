package com.grandhotel.billing;

import org.springframework.security.core.context.SecurityContextHolder;

final class Roles {

    private Roles() {
    }

    static boolean isManager() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_MANAGER"));
    }
}
