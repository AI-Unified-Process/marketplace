package com.grandhotel.reservations;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

@Component
public class ConfirmationMailer {

    private final JavaMailSender mail;

    public ConfirmationMailer(JavaMailSender mail) {
        this.mail = mail;
    }

    public void sendConfirmation(String to, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Your Grand Hotel reservation " + code);
        message.setText("Your reservation " + code + " is confirmed.");
        mail.send(message);
    }
}
