package com.grandhotel.common;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;

/** Writes the technical audit trail (audit_log) for every domain change event. */
@Component
public class AuditListener {

    private final JdbcClient jdbc;

    public AuditListener(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    @TransactionalEventListener
    public void on(DomainChange change) {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        jdbc.sql("INSERT INTO audit_log (entity_type, entity_id, action, changed_by) VALUES (?, ?, ?, ?)")
                .params(change.entityType(), change.entityId(), change.action(),
                        auth != null ? auth.getName() : "system")
                .update();
    }

    public record DomainChange(String entityType, long entityId, String action) {
    }
}
