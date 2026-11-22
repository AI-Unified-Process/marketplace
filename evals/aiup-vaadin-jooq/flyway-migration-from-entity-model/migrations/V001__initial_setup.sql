-- V001__initial_setup.sql
-- Initial schema versioning table setup

CREATE TABLE schema_version_log (
    id          SERIAL PRIMARY KEY,
    event       VARCHAR(255) NOT NULL,
    applied_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

INSERT INTO schema_version_log (event) VALUES ('Schema initialized');
