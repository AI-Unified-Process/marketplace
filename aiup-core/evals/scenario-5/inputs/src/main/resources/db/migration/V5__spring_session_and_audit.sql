-- Spring Session JDBC tables (managed by Spring framework, not domain entities)
CREATE TABLE spring_session (
    primary_id            CHAR(36)     NOT NULL,
    session_id            CHAR(36)     NOT NULL,
    creation_time         BIGINT       NOT NULL,
    last_access_time      BIGINT       NOT NULL,
    max_inactive_interval INT          NOT NULL,
    expiry_time           BIGINT       NOT NULL,
    principal_name        VARCHAR(100),
    PRIMARY KEY (primary_id)
);

CREATE TABLE spring_session_attributes (
    session_primary_id CHAR(36)     NOT NULL REFERENCES spring_session(primary_id) ON DELETE CASCADE,
    attribute_name     VARCHAR(200) NOT NULL,
    attribute_bytes    BYTEA        NOT NULL,
    PRIMARY KEY (session_primary_id, attribute_name)
);

-- Audit log table (infrastructure, not domain)
CREATE TABLE audit_log (
    id          BIGSERIAL    PRIMARY KEY,
    user_id     BIGINT,
    action      VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id   BIGINT,
    details     TEXT,
    ip_address  VARCHAR(45),
    occurred_at TIMESTAMP    NOT NULL DEFAULT now()
);
