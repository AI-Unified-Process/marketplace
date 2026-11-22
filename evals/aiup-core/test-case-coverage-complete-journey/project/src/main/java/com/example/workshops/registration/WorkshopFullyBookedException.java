package com.example.workshops.registration;

public class WorkshopFullyBookedException extends RuntimeException {

    public WorkshopFullyBookedException() {
        super("This workshop is fully booked.");
    }
}
