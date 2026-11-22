insert into guest (id, first_name, last_name, email, birth_date, registered_at)
values (nextval('guest_seq'), 'Alice', 'Arnold', 'alice@example.com', date '1980-02-01', timestamp '2026-01-01 09:00:00');
