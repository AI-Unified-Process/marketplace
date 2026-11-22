CREATE SEQUENCE plot_seq START WITH 1 INCREMENT BY 1 CACHE 50;

CREATE TABLE plot
(
    id     BIGINT DEFAULT nextval('plot_seq') PRIMARY KEY,
    number VARCHAR(10) NOT NULL UNIQUE,
    area   INTEGER     NOT NULL CHECK (area >= 1),
    closed BOOLEAN     NOT NULL
);
