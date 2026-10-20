package com.grandhotel.billing;

import com.grandhotel.common.BusinessException;
import com.grandhotel.guests.LoyaltyService;
import com.grandhotel.reservations.FrontDeskService.GuestCheckedOut;
import com.grandhotel.reservations.ReservationService.ReservationCancelled;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionalEventListener;

@Service
public class BillingService {

    static final BigDecimal ACCOMMODATION_VAT = new BigDecimal("3.80");
    static final BigDecimal REFUND_APPROVAL_LIMIT = new BigDecimal("500.00");

    private final JdbcClient jdbc;
    private final LoyaltyService loyalty;

    public BillingService(JdbcClient jdbc, LoyaltyService loyalty) {
        this.jdbc = jdbc;
        this.loyalty = loyalty;
    }

    /** The invoice is issued automatically at check-out: one line for the nights stayed. */
    @TransactionalEventListener
    @Transactional
    public void on(GuestCheckedOut event) {
        issue(event.reservationId(), "Accommodation", """
                SELECT (x.departure - x.arrival) AS quantity, rp.price_per_night AS unit_price
                FROM reservation x JOIN rate_plan rp ON rp.id = x.rate_plan_id WHERE x.id = ?""");
    }

    /** A cancellation fee is invoiced like a stay of one night. */
    @TransactionalEventListener
    @Transactional
    public void on(ReservationCancelled event) {
        if (event.fee().signum() > 0) {
            issue(event.reservationId(), "Cancellation fee", """
                    SELECT 1 AS quantity, rp.price_per_night AS unit_price
                    FROM reservation x JOIN rate_plan rp ON rp.id = x.rate_plan_id WHERE x.id = ?""");
        }
    }

    private void issue(long reservationId, String description, String lineQuery) {
        var line = jdbc.sql(lineQuery).param(reservationId).query().singleRow();
        BigDecimal total = ((BigDecimal) line.get("unit_price"))
                .multiply(BigDecimal.valueOf(((Number) line.get("quantity")).longValue()));
        long invoiceId = jdbc.sql("""
                        INSERT INTO invoice (reservation_id, guest_id, number, issued_on, total)
                        SELECT id, guest_id, ?, ?, ? FROM reservation WHERE id = ? RETURNING id""")
                .params(InvoiceNumber.next(jdbc), LocalDate.now(), total, reservationId).query(Long.class).single();
        jdbc.sql("INSERT INTO invoice_line (invoice_id, description, quantity, unit_price, vat_rate) "
                        + "VALUES (?, ?, ?, ?, ?)")
                .params(invoiceId, description, line.get("quantity"), line.get("unit_price"), ACCOMMODATION_VAT)
                .update();
    }

    @Transactional
    public void recordPayment(String number, BigDecimal amount, String method, String providerRef) {
        var invoice = jdbc.sql("SELECT id, guest_id, total, status FROM invoice WHERE number = ?").param(number)
                .query().singleRow();
        if (!"OPEN".equals(invoice.get("status"))) {
            throw new BusinessException("INVOICE_CLOSED", "Invoice is not open");
        }
        if (providerRef != null && jdbc.sql("SELECT count(*) > 0 FROM payment WHERE provider_ref = ?")
                .param(providerRef).query(Boolean.class).single()) {
            return; // the provider repeats webhooks; a payment is booked once
        }
        BigDecimal paid = paidOn((Long) invoice.get("id"));
        BigDecimal total = (BigDecimal) invoice.get("total");
        if (paid.add(amount).compareTo(total) > 0) {
            throw new BusinessException("OVERPAYMENT", "Payment exceeds the open amount");
        }
        jdbc.sql("INSERT INTO payment (invoice_id, amount, method, provider_ref) VALUES (?, ?, ?, ?)")
                .params(invoice.get("id"), amount, method, providerRef).update();
        if (paid.add(amount).compareTo(total) == 0) {
            jdbc.sql("UPDATE invoice SET status = 'PAID' WHERE id = ?").param(invoice.get("id")).update();
            loyalty.earn((Long) invoice.get("guest_id"), total, number);
        }
    }

    @Transactional
    public void refund(String accountant, long paymentId, BigDecimal amount, String reason) {
        BigDecimal paid = jdbc.sql("SELECT amount FROM payment WHERE id = ?").param(paymentId)
                .query(BigDecimal.class).single();
        BigDecimal refunded = jdbc.sql("SELECT coalesce(sum(amount), 0) FROM refund WHERE payment_id = ?")
                .param(paymentId).query(BigDecimal.class).single();
        if (refunded.add(amount).compareTo(paid) > 0) {
            throw new BusinessException("REFUND_TOO_HIGH", "Refunds cannot exceed the payment");
        }
        if (amount.compareTo(REFUND_APPROVAL_LIMIT) > 0 && !Roles.isManager()) {
            throw new BusinessException("APPROVAL_NEEDED", "Refunds over CHF 500 need a manager");
        }
        jdbc.sql("INSERT INTO refund (payment_id, amount, reason, approved_by) VALUES (?, ?, ?, ?)")
                .params(paymentId, amount, reason, accountant).update();
    }

    @Transactional
    public void voidInvoice(String number) {
        long payments = jdbc.sql("SELECT count(*) FROM payment p JOIN invoice i ON i.id = p.invoice_id "
                + "WHERE i.number = ?").param(number).query(Long.class).single();
        if (payments > 0) {
            throw new BusinessException("HAS_PAYMENTS", "An invoice with payments cannot be voided");
        }
        jdbc.sql("UPDATE invoice SET status = 'VOID' WHERE number = ? AND status = 'OPEN'").param(number).update();
    }

    public List<InvoiceView> invoicesOf(String email) {
        return jdbc.sql(INVOICES + " JOIN guest g ON g.id = i.guest_id WHERE g.email = lower(?) "
                + "ORDER BY i.issued_on DESC").param(email).query(InvoiceView.class).list();
    }

    public List<InvoiceView> openInvoices() {
        return jdbc.sql(INVOICES + " WHERE i.status = 'OPEN' ORDER BY i.issued_on").query(InvoiceView.class).list();
    }

    private BigDecimal paidOn(long invoiceId) {
        return jdbc.sql("SELECT coalesce(sum(amount), 0) FROM payment WHERE invoice_id = ?").param(invoiceId)
                .query(BigDecimal.class).single();
    }

    static final String INVOICES = "SELECT i.number, i.issued_on, i.total, i.status FROM invoice i";

    public record InvoiceView(String number, LocalDate issuedOn, BigDecimal total, String status) {
    }
}
