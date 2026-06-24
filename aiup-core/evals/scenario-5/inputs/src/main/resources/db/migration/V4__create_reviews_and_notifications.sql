CREATE SEQUENCE review_seq START 1 INCREMENT 50;
CREATE SEQUENCE notification_seq START 1 INCREMENT 50;

CREATE TABLE reviews (
    id          BIGINT    PRIMARY KEY DEFAULT nextval('review_seq'),
    order_id    BIGINT    NOT NULL REFERENCES orders(id),
    product_id  BIGINT    NOT NULL REFERENCES products(id),
    reviewer_id BIGINT    NOT NULL REFERENCES users(id),
    rating      SMALLINT  NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment     VARCHAR(1000),
    created_at  TIMESTAMP NOT NULL DEFAULT now(),
    UNIQUE (order_id, product_id)
);

CREATE TABLE notifications (
    id         BIGINT       PRIMARY KEY DEFAULT nextval('notification_seq'),
    user_id    BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type       VARCHAR(50)  NOT NULL,
    message    VARCHAR(500) NOT NULL,
    read       BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP    NOT NULL DEFAULT now()
);

CREATE TABLE notification_preferences (
    user_id           BIGINT  PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    email_on_order    BOOLEAN NOT NULL DEFAULT TRUE,
    email_on_review   BOOLEAN NOT NULL DEFAULT TRUE,
    email_on_promo    BOOLEAN NOT NULL DEFAULT FALSE,
    push_on_order     BOOLEAN NOT NULL DEFAULT TRUE,
    push_on_review    BOOLEAN NOT NULL DEFAULT TRUE
);
