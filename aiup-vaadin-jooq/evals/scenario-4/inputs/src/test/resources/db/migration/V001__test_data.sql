-- Test data for room management tests
CREATE SEQUENCE IF NOT EXISTS room_seq START WITH 100 INCREMENT BY 1 CACHE 50;

CREATE TABLE IF NOT EXISTS room (
    id          BIGINT PRIMARY KEY DEFAULT nextval('room_seq'),
    name        VARCHAR(255) NOT NULL UNIQUE,
    capacity    INT NOT NULL,
    archived    BOOLEAN NOT NULL DEFAULT FALSE
);

INSERT INTO room (id, name, capacity, archived) VALUES
    (1, 'Conference Room A', 20, FALSE),
    (2, 'Board Room',        10, FALSE),
    (3, 'Training Room',     30, FALSE),
    (4, 'Huddle Room 1',      4, FALSE),
    (5, 'Huddle Room 2',      4, FALSE);

-- Simulate a room that has active reservations (used by A1 alternative flow in UC-006)
CREATE SEQUENCE IF NOT EXISTS reservation_seq START WITH 100 INCREMENT BY 1 CACHE 50;

CREATE TABLE IF NOT EXISTS reservation (
    id      BIGINT PRIMARY KEY DEFAULT nextval('reservation_seq'),
    room_id BIGINT NOT NULL REFERENCES room(id),
    guest   VARCHAR(255) NOT NULL,
    active  BOOLEAN NOT NULL DEFAULT TRUE
);

INSERT INTO reservation (id, room_id, guest, active) VALUES
    (1, 1, 'Alice Smith', TRUE);
