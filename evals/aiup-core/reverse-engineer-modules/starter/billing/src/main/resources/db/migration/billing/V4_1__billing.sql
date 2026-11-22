CREATE TABLE invoice
(
    id             BIGSERIAL PRIMARY KEY,
    reservation_id BIGINT         NOT NULL UNIQUE REFERENCES reservation (id),
    guest_id       BIGINT         NOT NULL REFERENCES guest (id),
    number         VARCHAR(12)    NOT NULL UNIQUE,
    issued_on      DATE           NOT NULL,
    total          NUMERIC(12, 2) NOT NULL CHECK (total >= 0),
    status         VARCHAR(10)    NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'PAID', 'VOID'))
);

CREATE TABLE invoice_line
(
    id          BIGSERIAL PRIMARY KEY,
    invoice_id  BIGINT         NOT NULL REFERENCES invoice (id) ON DELETE CASCADE,
    description VARCHAR(200)   NOT NULL,
    quantity    INTEGER        NOT NULL CHECK (quantity >= 1),
    unit_price  NUMERIC(10, 2) NOT NULL,
    vat_rate    NUMERIC(4, 2)  NOT NULL CHECK (vat_rate IN (2.60, 3.80, 8.10))
);

CREATE TABLE payment
(
    id           BIGSERIAL PRIMARY KEY,
    invoice_id   BIGINT         NOT NULL REFERENCES invoice (id),
    amount       NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    method       VARCHAR(10)    NOT NULL CHECK (method IN ('CARD', 'CASH', 'TRANSFER')),
    provider_ref VARCHAR(64) UNIQUE,
    paid_at      TIMESTAMP      NOT NULL DEFAULT now()
);

CREATE TABLE refund
(
    id          BIGSERIAL PRIMARY KEY,
    payment_id  BIGINT         NOT NULL REFERENCES payment (id),
    amount      NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    reason      VARCHAR(500)   NOT NULL,
    approved_by VARCHAR(50)    NOT NULL,
    refunded_at TIMESTAMP      NOT NULL DEFAULT now()
);
