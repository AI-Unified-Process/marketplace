create sequence guest_seq start with 1000 increment by 50;

create table guest
(
    id            bigint       not null default nextval('guest_seq') primary key,
    first_name    varchar(100) not null,
    last_name     varchar(100) not null,
    email         varchar(255) not null,
    birth_date    date         not null,
    registered_at timestamp    not null,
    -- UC-001 BR-002: An email address belongs to at most one guest.
    constraint uq_guest_email unique (email)
);
