package com.grandhotel.billing;

import java.math.BigDecimal;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

/** Card payments made on the guest's payment page are confirmed by the payment provider. */
@RestController
public class PaymentWebhookController {

    private final BillingService billing;
    private final WebhookSignature signature;

    public PaymentWebhookController(BillingService billing, WebhookSignature signature) {
        this.billing = billing;
        this.signature = signature;
    }

    @PostMapping("/api/payments/webhook")
    public ResponseEntity<Void> paid(@RequestHeader("X-Signature") String sig, @RequestBody Event event) {
        if (!signature.valid(sig, event)) {
            return ResponseEntity.status(401).build();
        }
        billing.recordPayment(event.invoiceNumber(), event.amount(), "CARD", event.reference());
        return ResponseEntity.ok().build();
    }

    public record Event(String reference, String invoiceNumber, BigDecimal amount) {
    }
}
