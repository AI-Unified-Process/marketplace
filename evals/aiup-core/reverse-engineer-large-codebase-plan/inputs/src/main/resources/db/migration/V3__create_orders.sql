CREATE SEQUENCE order_seq START 1 INCREMENT 50;
CREATE SEQUENCE order_item_seq START 1 INCREMENT 50;

CREATE TABLE orders (
    id               BIGINT         PRIMARY KEY DEFAULT nextval('order_seq'),
    buyer_id         BIGINT         NOT NULL REFERENCES users(id),
    status           VARCHAR(20)    NOT NULL DEFAULT 'PLACED'
                                    CHECK (status IN ('PLACED', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED')),
    total_amount     NUMERIC(10, 2) NOT NULL,
    shipping_address VARCHAR(500)   NOT NULL,
    tracking_number  VARCHAR(100),
    placed_at        TIMESTAMP      NOT NULL DEFAULT now(),
    shipped_at       TIMESTAMP,
    delivered_at     TIMESTAMP
);

CREATE TABLE order_items (
    id         BIGINT         PRIMARY KEY DEFAULT nextval('order_item_seq'),
    order_id   BIGINT         NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id BIGINT         NOT NULL REFERENCES products(id),
    quantity   INTEGER        NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL
);

CREATE TABLE cart_items (
    id         BIGINT   PRIMARY KEY DEFAULT nextval('order_item_seq'),
    user_id    BIGINT   NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id BIGINT   NOT NULL REFERENCES products(id),
    quantity   INTEGER  NOT NULL DEFAULT 1,
    added_at   TIMESTAMP NOT NULL DEFAULT now(),
    UNIQUE (user_id, product_id)
);
