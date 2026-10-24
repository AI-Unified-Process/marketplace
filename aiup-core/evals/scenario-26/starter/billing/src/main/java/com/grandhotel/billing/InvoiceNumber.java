package com.grandhotel.billing;

import java.time.Year;
import org.springframework.jdbc.core.simple.JdbcClient;

final class InvoiceNumber {

    private InvoiceNumber() {
    }

    /** Invoice numbers run per year without gaps: 2026-000001, 2026-000002, ... */
    static String next(JdbcClient jdbc) {
        String year = Year.now().toString();
        long last = jdbc.sql("SELECT count(*) FROM invoice WHERE number LIKE ?").param(year + "-%")
                .query(Long.class).single();
        return "%s-%06d".formatted(year, last + 1);
    }
}
