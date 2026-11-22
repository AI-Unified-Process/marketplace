-- UC-002 test data; the fixed test clock is 2027-01-10 10:00.
INSERT INTO workshop (id, title, starts_at, capacity)
VALUES (900, 'Domain-Driven Design', '2027-02-01 09:00', 20),
       (901, 'Testing with Testcontainers', '2027-02-03 09:00', 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO registration (id, workshop_id, participant_name, participant_email, registered_at)
VALUES (900, 901, 'Lena Brunner', 'lena.brunner@example.com', '2027-01-05 08:00'),
       (901, 900, 'Marco Rossi', 'marco.rossi@example.com', '2027-01-06 08:00')
ON CONFLICT (id) DO NOTHING;
