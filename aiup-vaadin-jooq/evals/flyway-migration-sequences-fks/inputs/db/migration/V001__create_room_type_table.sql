-- V001__create_room_type_table.sql

CREATE SEQUENCE room_type_seq START WITH 1 INCREMENT BY 1 CACHE 50;

CREATE TABLE room_type
(
    id          BIGINT DEFAULT nextval('room_type_seq') PRIMARY KEY,
    name        VARCHAR(50)    NOT NULL UNIQUE,
    description VARCHAR(500),
    capacity    INTEGER        NOT NULL CHECK (capacity BETWEEN 1 AND 10),
    price       DECIMAL(10, 2) NOT NULL CHECK (price >= 0)
);
