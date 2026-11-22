CREATE SEQUENCE purchase_order_seq START WITH 1 INCREMENT BY 1 CACHE 50;
CREATE SEQUENCE order_line_seq START WITH 1 INCREMENT BY 1 CACHE 50;

CREATE TABLE purchase_order
(
    id          BIGINT DEFAULT nextval('purchase_order_seq') PRIMARY KEY,
    order_date  DATE        NOT NULL,
    status      VARCHAR(20) NOT NULL,
    version     INTEGER     NOT NULL DEFAULT 0
);

CREATE TABLE order_line
(
    id                BIGINT DEFAULT nextval('order_line_seq') PRIMARY KEY,
    purchase_order_id BIGINT         NOT NULL REFERENCES purchase_order (id),
    product_id        BIGINT         NOT NULL REFERENCES product (id),
    quantity          INTEGER        NOT NULL CHECK (quantity > 0),
    price             DECIMAL(10, 2) NOT NULL
);
