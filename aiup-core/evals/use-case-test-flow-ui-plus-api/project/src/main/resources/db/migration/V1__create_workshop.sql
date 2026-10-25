CREATE SEQUENCE workshop_seq START WITH 1000;

CREATE TABLE workshop
(
    id        BIGINT       NOT NULL DEFAULT nextval('workshop_seq') PRIMARY KEY,
    title     VARCHAR(200) NOT NULL,
    starts_at TIMESTAMP    NOT NULL,
    capacity  INTEGER      NOT NULL CHECK (capacity >= 1)
);
