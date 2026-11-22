CREATE SEQUENCE registration_seq START WITH 1000;

CREATE TABLE registration
(
    id                BIGINT       NOT NULL DEFAULT nextval('registration_seq') PRIMARY KEY,
    workshop_id       BIGINT       NOT NULL REFERENCES workshop (id),
    participant_name  VARCHAR(100) NOT NULL,
    participant_email VARCHAR(255) NOT NULL,
    registered_at     TIMESTAMP    NOT NULL,
    -- UC-002 BR-003: A participant email can be registered only once for the same workshop.
    CONSTRAINT registration_workshop_email_uk UNIQUE (workshop_id, participant_email)
);
