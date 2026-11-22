create sequence guest_seq start with 1000;

create table guest
(
    id            bigint primary key default nextval('guest_seq'),
    first_name    varchar(100) not null,
    last_name     varchar(100) not null,
    email         varchar(255) not null unique,
    date_of_birth date         not null
);
