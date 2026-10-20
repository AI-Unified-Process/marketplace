package com.grandhotel.billing;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class WebhookSignature {

    private final String secret;

    public WebhookSignature(@Value("${pms.payments.webhook-secret}") String secret) {
        this.secret = secret;
    }

    boolean valid(String signature, PaymentWebhookController.Event event) {
        return Hmac.sha256(secret, event.reference() + event.invoiceNumber() + event.amount()).equals(signature);
    }
}
