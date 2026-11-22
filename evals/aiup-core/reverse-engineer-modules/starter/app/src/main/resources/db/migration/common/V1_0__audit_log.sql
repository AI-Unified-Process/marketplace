-- Technical audit trail written by platform-common's AuditListener for every change.
CREATE TABLE audit_log
(
    id          BIGSERIAL PRIMARY KEY,
    entity_type VARCHAR(100) NOT NULL,
    entity_id   BIGINT       NOT NULL,
    action      VARCHAR(20)  NOT NULL,
    changed_by  VARCHAR(100) NOT NULL,
    changed_at  TIMESTAMP    NOT NULL DEFAULT now()
);
