CREATE TABLE housekeeper
(
    id       BIGSERIAL PRIMARY KEY,
    username VARCHAR(50)  NOT NULL UNIQUE,
    name     VARCHAR(100) NOT NULL,
    active   BOOLEAN      NOT NULL DEFAULT true
);

CREATE TABLE cleaning_task
(
    id             BIGSERIAL PRIMARY KEY,
    room_id        BIGINT      NOT NULL REFERENCES room (id),
    housekeeper_id BIGINT REFERENCES housekeeper (id),
    task_date      DATE        NOT NULL,
    kind           VARCHAR(10) NOT NULL CHECK (kind IN ('STAYOVER', 'DEPARTURE', 'DEEP')),
    status         VARCHAR(10) NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'DONE')),
    completed_at   TIMESTAMP,
    UNIQUE (room_id, task_date)
);

CREATE TABLE inspection
(
    id               BIGSERIAL PRIMARY KEY,
    cleaning_task_id BIGINT       NOT NULL UNIQUE REFERENCES cleaning_task (id),
    inspector        VARCHAR(50)  NOT NULL,
    passed           BOOLEAN      NOT NULL,
    remarks          VARCHAR(500),
    inspected_at     TIMESTAMP    NOT NULL DEFAULT now()
);

CREATE TABLE maintenance_request
(
    id          BIGSERIAL PRIMARY KEY,
    room_id     BIGINT       NOT NULL REFERENCES room (id),
    reported_by VARCHAR(50)  NOT NULL,
    description VARCHAR(1000) NOT NULL,
    priority    VARCHAR(10)  NOT NULL CHECK (priority IN ('LOW', 'NORMAL', 'URGENT')),
    status      VARCHAR(12)  NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'IN_PROGRESS', 'RESOLVED')),
    reported_at TIMESTAMP    NOT NULL DEFAULT now(),
    resolved_at TIMESTAMP
);
