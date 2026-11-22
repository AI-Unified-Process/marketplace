package com.grandhotel.guests;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

@Component
public class WelcomeMailer {

    private final JavaMailSender mail;

    public WelcomeMailer(JavaMailSender mail) {
        this.mail = mail;
    }

    public void sendWelcome(String to, String firstName) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Welcome to Grand Hotel");
        message.setText("Dear " + firstName + ", your Grand Hotel account and loyalty membership are ready.");
        mail.send(message);
    }
}
