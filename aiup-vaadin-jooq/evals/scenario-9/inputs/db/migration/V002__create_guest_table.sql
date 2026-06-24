-- V002__create_guest_table.sql

CREATE SEQUENCE guest_seq START WITH 1 INCREMENT BY 1 CACHE 50;

CREATE TABLE guest
(
    id         BIGINT DEFAULT nextval('guest_seq') PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name  VARCHAR(100) NOT NULL,
    email      VARCHAR(255) NOT NULL UNIQUE,
    phone      VARCHAR(20)
);
