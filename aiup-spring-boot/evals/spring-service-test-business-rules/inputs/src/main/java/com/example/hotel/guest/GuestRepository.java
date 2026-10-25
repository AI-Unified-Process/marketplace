package com.example.hotel.guest;

import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.example.hotel.jooq.Tables.GUEST;

@Repository
public class GuestRepository {

    private final DSLContext ctx;

    public GuestRepository(DSLContext ctx) {
        this.ctx = ctx;
    }

    public List<Guest> findAll() {
        return ctx.selectFrom(GUEST).orderBy(GUEST.LAST_NAME, GUEST.FIRST_NAME).fetchInto(Guest.class);
    }

    public boolean existsByEmail(String email) {
        return ctx.fetchExists(GUEST, GUEST.EMAIL.eq(email));
    }

    public Guest insert(Guest guest) {
        return ctx.insertInto(GUEST)
                .set(GUEST.FIRST_NAME, guest.firstName())
                .set(GUEST.LAST_NAME, guest.lastName())
                .set(GUEST.EMAIL, guest.email())
                .set(GUEST.BIRTH_DATE, guest.birthDate())
                .set(GUEST.REGISTERED_AT, guest.registeredAt())
                .returning()
                .fetchOneInto(Guest.class);
    }
}
