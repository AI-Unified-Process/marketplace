CREATE TABLE room_type
(
    id          BIGSERIAL PRIMARY KEY,
    code        VARCHAR(10)  NOT NULL UNIQUE,
    name        VARCHAR(100) NOT NULL,
    max_guests  INTEGER      NOT NULL CHECK (max_guests BETWEEN 1 AND 6),
    description TEXT
);

CREATE TABLE room
(
    id           BIGSERIAL PRIMARY KEY,
    room_type_id BIGINT      NOT NULL REFERENCES room_type (id),
    number       VARCHAR(5)  NOT NULL UNIQUE,
    floor        INTEGER     NOT NULL,
    status       VARCHAR(15) NOT NULL DEFAULT 'CLEAN'
        CHECK (status IN ('CLEAN', 'DIRTY', 'INSPECTED', 'OUT_OF_ORDER'))
);

CREATE TABLE rate_plan
(
    id              BIGSERIAL PRIMARY KEY,
    room_type_id    BIGINT        NOT NULL REFERENCES room_type (id),
    name            VARCHAR(100)  NOT NULL,
    price_per_night NUMERIC(10, 2) NOT NULL CHECK (price_per_night >= 0),
    refundable      BOOLEAN       NOT NULL,
    valid_from      DATE          NOT NULL,
    valid_to        DATE          NOT NULL,
    CHECK (valid_to >= valid_from)
);

CREATE TABLE reservation
(
    id           BIGSERIAL PRIMARY KEY,
    guest_id     BIGINT      NOT NULL REFERENCES guest (id),
    rate_plan_id BIGINT      NOT NULL REFERENCES rate_plan (id),
    code         VARCHAR(8)  NOT NULL UNIQUE,
    arrival      DATE        NOT NULL,
    departure    DATE        NOT NULL,
    adults       INTEGER     NOT NULL CHECK (adults >= 1),
    status       VARCHAR(12) NOT NULL DEFAULT 'BOOKED'
        CHECK (status IN ('BOOKED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED', 'NO_SHOW')),
    created_at   TIMESTAMP   NOT NULL DEFAULT now(),
    version      INTEGER     NOT NULL DEFAULT 0,
    CHECK (departure > arrival)
);

CREATE TABLE reservation_room
(
    reservation_id BIGINT NOT NULL REFERENCES reservation (id) ON DELETE CASCADE,
    room_id        BIGINT NOT NULL REFERENCES room (id),
    PRIMARY KEY (reservation_id, room_id)
);
