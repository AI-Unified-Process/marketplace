package com.grandhotel.billing;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;
import java.security.Principal;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class BillingController {

    private final BillingService billing;

    public BillingController(BillingService billing) {
        this.billing = billing;
    }

    @GetMapping("/me/invoices")
    public List<BillingService.InvoiceView> myInvoices(Principal principal) {
        return billing.invoicesOf(principal.getName());
    }

    @PostMapping("/front-desk/invoices/{number}/payments")
    public void pay(@PathVariable String number, @Valid @RequestBody Payment payment) {
        billing.recordPayment(number, payment.amount(), payment.method(), null);
    }

    @GetMapping("/billing/invoices")
    public List<BillingService.InvoiceView> open() {
        return billing.openInvoices();
    }

    @PostMapping("/billing/payments/{id}/refunds")
    public void refund(Principal principal, @PathVariable long id, @Valid @RequestBody Refund refund) {
        billing.refund(principal.getName(), id, refund.amount(), refund.reason());
    }

    @PostMapping("/billing/invoices/{number}/void")
    public void voidInvoice(@PathVariable String number) {
        billing.voidInvoice(number);
    }

    public record Payment(@DecimalMin("0.01") BigDecimal amount, @NotBlank String method) {
    }

    public record Refund(@DecimalMin("0.01") BigDecimal amount, @NotBlank String reason) {
    }
}
