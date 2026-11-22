CREATE SEQUENCE reservation_seq START WITH 1 INCREMENT BY 1 CACHE 50;

CREATE TABLE reservation
(
    id             BIGINT DEFAULT nextval('reservation_seq') PRIMARY KEY,
    version        INTEGER     NOT NULL DEFAULT 0,
    guest_id       BIGINT      NOT NULL REFERENCES guest (id),
    room_type_id   BIGINT      NOT NULL REFERENCES room_type (id),
    arrival_date   DATE        NOT NULL,
    departure_date DATE        NOT NULL,
    status         VARCHAR(20) NOT NULL CHECK (status IN ('CONFIRMED', 'CHECKED_IN', 'CANCELLED')),
    CHECK (departure_date > arrival_date)
);

CREATE INDEX reservation_arrival_date_idx ON reservation (arrival_date);
