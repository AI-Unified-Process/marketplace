CREATE SEQUENCE user_seq START 1 INCREMENT 50;

CREATE TABLE users (
    id            BIGINT PRIMARY KEY DEFAULT nextval('user_seq'),
    email         VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(100) NOT NULL,
    first_name    VARCHAR(50)  NOT NULL,
    last_name     VARCHAR(50)  NOT NULL,
    role          VARCHAR(20)  NOT NULL CHECK (role IN ('BUYER', 'ARTISAN', 'ADMIN', 'MANAGER')),
    email_verified BOOLEAN     NOT NULL DEFAULT FALSE,
    active        BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMP    NOT NULL DEFAULT now(),
    last_login_at TIMESTAMP
);
