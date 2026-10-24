CREATE TABLE guest
(
    id            BIGSERIAL PRIMARY KEY,
    first_name    VARCHAR(100) NOT NULL,
    last_name     VARCHAR(100) NOT NULL,
    email         VARCHAR(255) NOT NULL UNIQUE,
    phone         VARCHAR(30),
    date_of_birth DATE         NOT NULL,
    vip           BOOLEAN      NOT NULL DEFAULT false,
    created_at    TIMESTAMP    NOT NULL DEFAULT now()
);

CREATE TABLE guest_address
(
    id          BIGSERIAL PRIMARY KEY,
    guest_id    BIGINT       NOT NULL REFERENCES guest (id) ON DELETE CASCADE,
    kind        VARCHAR(10)  NOT NULL CHECK (kind IN ('HOME', 'BILLING')),
    street      VARCHAR(200) NOT NULL,
    postal_code VARCHAR(10)  NOT NULL,
    city        VARCHAR(100) NOT NULL,
    country     CHAR(2)      NOT NULL,
    UNIQUE (guest_id, kind)
);

CREATE TABLE loyalty_account
(
    id       BIGSERIAL PRIMARY KEY,
    guest_id BIGINT      NOT NULL UNIQUE REFERENCES guest (id) ON DELETE CASCADE,
    tier     VARCHAR(10) NOT NULL DEFAULT 'SILVER' CHECK (tier IN ('SILVER', 'GOLD', 'PLATINUM')),
    points   INTEGER     NOT NULL DEFAULT 0 CHECK (points >= 0)
);

CREATE TABLE loyalty_transaction
(
    id                 BIGSERIAL PRIMARY KEY,
    loyalty_account_id BIGINT       NOT NULL REFERENCES loyalty_account (id) ON DELETE CASCADE,
    points             INTEGER      NOT NULL,
    reason             VARCHAR(200) NOT NULL,
    booked_at          TIMESTAMP    NOT NULL DEFAULT now()
);
