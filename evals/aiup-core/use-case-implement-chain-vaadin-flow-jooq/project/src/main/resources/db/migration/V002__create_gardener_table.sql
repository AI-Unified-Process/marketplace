CREATE SEQUENCE gardener_seq START WITH 1 INCREMENT BY 1 CACHE 50;

CREATE TABLE gardener
(
    id         BIGINT DEFAULT nextval('gardener_seq') PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name  VARCHAR(100) NOT NULL,
    email      VARCHAR(255) NOT NULL UNIQUE
);
