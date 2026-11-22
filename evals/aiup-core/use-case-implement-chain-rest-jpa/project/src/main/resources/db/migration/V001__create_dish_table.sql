CREATE SEQUENCE dish_seq START WITH 1 INCREMENT BY 1 CACHE 50;

CREATE TABLE dish
(
    id         BIGINT DEFAULT nextval('dish_seq') PRIMARY KEY,
    name       VARCHAR(100)  NOT NULL,
    lunch_date DATE          NOT NULL,
    price      DECIMAL(6, 2) NOT NULL CHECK (price >= 0),
    portions   INTEGER       NOT NULL CHECK (portions >= 1)
);
