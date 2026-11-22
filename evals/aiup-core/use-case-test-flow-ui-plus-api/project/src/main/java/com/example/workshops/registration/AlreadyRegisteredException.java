package com.example.workshops.registration;

public class AlreadyRegisteredException extends RuntimeException {

    public AlreadyRegisteredException() {
        super("You are already registered for this workshop.");
    }
}
