CREATE SEQUENCE category_seq START 1 INCREMENT 50;
CREATE SEQUENCE product_seq START 1 INCREMENT 50;

CREATE TABLE categories (
    id          BIGINT      PRIMARY KEY DEFAULT nextval('category_seq'),
    name        VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(500),
    active      BOOLEAN      NOT NULL DEFAULT TRUE
);

CREATE TABLE products (
    id             BIGINT         PRIMARY KEY DEFAULT nextval('product_seq'),
    artisan_id     BIGINT         NOT NULL REFERENCES users(id),
    category_id    BIGINT         NOT NULL REFERENCES categories(id),
    title          VARCHAR(200)   NOT NULL,
    description    TEXT           NOT NULL,
    price          NUMERIC(10, 2) NOT NULL,
    stock_quantity INTEGER        NOT NULL DEFAULT 0,
    status         VARCHAR(20)    NOT NULL DEFAULT 'PENDING_APPROVAL'
                                  CHECK (status IN ('PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'ARCHIVED')),
    featured       BOOLEAN        NOT NULL DEFAULT FALSE,
    created_at     TIMESTAMP      NOT NULL DEFAULT now(),
    updated_at     TIMESTAMP
);

CREATE TABLE product_images (
    id         BIGINT       PRIMARY KEY DEFAULT nextval('product_seq'),
    product_id BIGINT       NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    url        VARCHAR(500) NOT NULL,
    sort_order INTEGER      NOT NULL DEFAULT 0
);
