package com.example.workshops.registration;

public class RegistrationClosedException extends RuntimeException {

    public RegistrationClosedException() {
        super("Registration for this workshop has closed.");
    }
}
