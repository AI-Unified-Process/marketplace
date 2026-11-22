package com.grandhotel.guests;

import com.grandhotel.common.BusinessException;
import com.grandhotel.common.NotFoundException;
import com.grandhotel.guests.GuestController.Address;
import com.grandhotel.guests.GuestController.GuestView;
import com.grandhotel.guests.GuestController.ProfileChange;
import com.grandhotel.guests.GuestController.Registration;
import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class GuestService {

    static final int MINIMUM_AGE = 18;

    private final JdbcClient jdbc;
    private final WelcomeMailer mailer;

    public GuestService(JdbcClient jdbc, WelcomeMailer mailer) {
        this.jdbc = jdbc;
        this.mailer = mailer;
    }

    @Transactional
    public GuestView register(Registration r) {
        if (Period.between(r.dateOfBirth(), LocalDate.now()).getYears() < MINIMUM_AGE) {
            throw new BusinessException("GUEST_TOO_YOUNG", "Guests must be at least 18 years old");
        }
        boolean taken = jdbc.sql("SELECT count(*) > 0 FROM guest WHERE lower(email) = lower(?)")
                .param(r.email()).query(Boolean.class).single();
        if (taken) {
            throw new BusinessException("EMAIL_TAKEN", "A guest with this email address already exists");
        }
        long id = jdbc.sql("""
                        INSERT INTO guest (first_name, last_name, email, phone, date_of_birth)
                        VALUES (?, ?, lower(?), ?, ?) RETURNING id""")
                .params(r.firstName(), r.lastName(), r.email(), r.phone(), r.dateOfBirth())
                .query(Long.class).single();
        // every guest gets a loyalty account at registration
        jdbc.sql("INSERT INTO loyalty_account (guest_id) VALUES (?)").param(id).update();
        mailer.sendWelcome(r.email(), r.firstName());
        return byId(id);
    }

    public GuestView byId(long id) {
        return jdbc.sql("SELECT id, first_name, last_name, email, phone, vip FROM guest WHERE id = ?")
                .param(id).query(GuestView.class).optional()
                .orElseThrow(() -> new NotFoundException("Guest", id));
    }

    public GuestView byEmail(String email) {
        return jdbc.sql("SELECT id, first_name, last_name, email, phone, vip FROM guest WHERE email = lower(?)")
                .param(email).query(GuestView.class).optional()
                .orElseThrow(() -> new NotFoundException("Guest", email));
    }

    public List<GuestView> search(String query) {
        if (query.trim().length() < 3) {
            throw new BusinessException("QUERY_TOO_SHORT", "Enter at least three characters");
        }
        return jdbc.sql("""
                        SELECT id, first_name, last_name, email, phone, vip FROM guest
                        WHERE last_name ILIKE ? OR email ILIKE ? ORDER BY last_name LIMIT 50""")
                .params("%" + query + "%", "%" + query + "%").query(GuestView.class).list();
    }

    @Transactional
    public GuestView updateProfile(String email, ProfileChange change) {
        GuestView guest = byEmail(email);
        jdbc.sql("UPDATE guest SET first_name = ?, last_name = ?, phone = ? WHERE id = ?")
                .params(change.firstName(), change.lastName(), change.phone(), guest.id()).update();
        return byId(guest.id());
    }

    @Transactional
    public void saveAddress(String email, String kind, Address a) {
        if (!kind.equals("HOME") && !kind.equals("BILLING")) {
            throw new BusinessException("ADDRESS_KIND", "Address must be HOME or BILLING");
        }
        GuestView guest = byEmail(email);
        jdbc.sql("""
                        INSERT INTO guest_address (guest_id, kind, street, postal_code, city, country)
                        VALUES (?, ?, ?, ?, ?, ?)
                        ON CONFLICT (guest_id, kind) DO UPDATE
                        SET street = excluded.street, postal_code = excluded.postal_code,
                            city = excluded.city, country = excluded.country""")
                .params(guest.id(), kind, a.street(), a.postalCode(), a.city(), a.country()).update();
    }

    @Transactional
    public void markVip(long id, boolean vip) {
        byId(id);
        jdbc.sql("UPDATE guest SET vip = ? WHERE id = ?").params(vip, id).update();
    }
}
