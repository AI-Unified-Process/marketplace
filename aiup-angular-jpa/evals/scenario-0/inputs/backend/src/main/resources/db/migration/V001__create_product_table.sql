CREATE SEQUENCE product_seq START WITH 1 INCREMENT BY 1 CACHE 50;

CREATE TABLE product
(
    id       BIGINT                  DEFAULT nextval('product_seq') PRIMARY KEY,
    name     VARCHAR(150)   NOT NULL,
    category VARCHAR(60)    NOT NULL,
    price    DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    in_stock BOOLEAN        NOT NULL DEFAULT TRUE
);
