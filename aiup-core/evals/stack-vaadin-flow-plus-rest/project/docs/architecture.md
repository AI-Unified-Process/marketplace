# Architecture

The clinic scheduling system is one Spring Boot application in the package `com.example.clinic`, one Maven module.

## Conventions

- Feature packages: `com.example.clinic.appointment`, `com.example.clinic.patient`.
- All times are stored in UTC and shown in the clinic's time zone, Europe/Zurich.
- Errors on the REST API are RFC 9457 Problem Details.
