CREATE SEQUENCE guest_seq START WITH 1 INCREMENT BY 1 CACHE 50;

CREATE TABLE guest
(
    id         BIGINT DEFAULT nextval('guest_seq') PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name  VARCHAR(100) NOT NULL,
    -- UC-020 BR-001: No two guest records may share the same email address.
    email      VARCHAR(150) NOT NULL UNIQUE
);
