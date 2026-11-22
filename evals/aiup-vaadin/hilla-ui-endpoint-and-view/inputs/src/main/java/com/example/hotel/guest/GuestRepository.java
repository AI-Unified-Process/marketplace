package com.example.hotel.guest;

import java.util.List;

import org.jooq.DSLContext;
import org.jooq.Records;
import org.springframework.stereotype.Repository;

import static com.example.hotel.db.Tables.GUEST;

/** UC-020 data access. */
@Repository
class GuestRepository {

    private final DSLContext ctx;

    GuestRepository(DSLContext ctx) {
        this.ctx = ctx;
    }

    List<Guest> findAll(int offset, int limit) {
        return ctx.select(GUEST.ID, GUEST.FIRST_NAME, GUEST.LAST_NAME, GUEST.EMAIL, GUEST.DATE_OF_BIRTH)
                .from(GUEST)
                .orderBy(GUEST.LAST_NAME, GUEST.FIRST_NAME)
                .offset(offset).limit(limit)
                .fetch(Records.mapping(Guest::new));
    }

    int count() {
        return ctx.fetchCount(GUEST);
    }

    boolean existsByEmail(String email) {
        return ctx.fetchExists(GUEST, GUEST.EMAIL.eq(email));
    }

    Guest insert(GuestRegistration registration) {
        return ctx.insertInto(GUEST)
                .set(GUEST.FIRST_NAME, registration.firstName())
                .set(GUEST.LAST_NAME, registration.lastName())
                .set(GUEST.EMAIL, registration.email())
                .set(GUEST.DATE_OF_BIRTH, registration.dateOfBirth())
                .returningResult(GUEST.ID, GUEST.FIRST_NAME, GUEST.LAST_NAME, GUEST.EMAIL, GUEST.DATE_OF_BIRTH)
                .fetchOne(Records.mapping(Guest::new));
    }
}
