CREATE SEQUENCE room_type_seq START WITH 1000 INCREMENT BY 1;
CREATE SEQUENCE guest_seq START WITH 1000 INCREMENT BY 1;
CREATE SEQUENCE reservation_seq START WITH 1000 INCREMENT BY 1;

CREATE TABLE room_type
(
    id       BIGINT DEFAULT nextval('room_type_seq') PRIMARY KEY,
    name     VARCHAR(50)    NOT NULL UNIQUE,
    capacity INTEGER        NOT NULL,
    price    DECIMAL(10, 2) NOT NULL
);

CREATE TABLE guest
(
    id         BIGINT DEFAULT nextval('guest_seq') PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name  VARCHAR(100) NOT NULL,
    email      VARCHAR(150) NOT NULL UNIQUE
);

CREATE TABLE reservation
(
    id           BIGINT DEFAULT nextval('reservation_seq') PRIMARY KEY,
    guest_id     BIGINT NOT NULL REFERENCES guest (id),
    room_type_id BIGINT NOT NULL REFERENCES room_type (id),
    arrival      DATE   NOT NULL,
    departure    DATE   NOT NULL
);
