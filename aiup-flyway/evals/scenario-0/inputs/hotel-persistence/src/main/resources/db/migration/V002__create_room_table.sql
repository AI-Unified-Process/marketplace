CREATE SEQUENCE room_seq START WITH 1 INCREMENT BY 1 CACHE 50;

CREATE TABLE room
(
    id           BIGINT DEFAULT nextval('room_seq') PRIMARY KEY,
    number       VARCHAR(10) NOT NULL,
    room_type_id BIGINT      NOT NULL REFERENCES room_type (id)
);
