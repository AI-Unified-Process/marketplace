package com.example.hotel.guest;

/** UC-020 A1: thrown when the email belongs to another guest. */
public class EmailAlreadyRegisteredException extends RuntimeException {

    public EmailAlreadyRegisteredException(String email) {
        super("Email already registered");
    }
}
