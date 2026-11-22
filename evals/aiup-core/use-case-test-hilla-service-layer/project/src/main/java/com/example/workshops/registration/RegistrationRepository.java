package com.example.workshops.registration;

import static com.example.workshops.db.tables.Registration.REGISTRATION;
import static com.example.workshops.db.tables.Workshop.WORKSHOP;
import static org.jooq.impl.DSL.count;

import java.time.LocalDateTime;
import java.util.List;

import org.jooq.DSLContext;
import org.jooq.Records;
import org.springframework.stereotype.Repository;

@Repository
public class RegistrationRepository {

    private final DSLContext dsl;

    public RegistrationRepository(DSLContext dsl) {
        this.dsl = dsl;
    }

    public List<UpcomingWorkshop> findUpcoming(LocalDateTime now) {
        var registrations = count(REGISTRATION.ID);
        return dsl.select(WORKSHOP.ID, WORKSHOP.TITLE, WORKSHOP.STARTS_AT, WORKSHOP.CAPACITY,
                        WORKSHOP.CAPACITY.minus(registrations))
                .from(WORKSHOP)
                .leftJoin(REGISTRATION).on(REGISTRATION.WORKSHOP_ID.eq(WORKSHOP.ID))
                .where(WORKSHOP.STARTS_AT.gt(now))
                .groupBy(WORKSHOP.ID)
                .orderBy(WORKSHOP.STARTS_AT)
                .fetch(Records.mapping(UpcomingWorkshop::new));
    }

    public int countByWorkshop(long workshopId) {
        return dsl.fetchCount(REGISTRATION, REGISTRATION.WORKSHOP_ID.eq(workshopId));
    }

    // UC-002 BR-003: A participant email can be registered only once for the same workshop.
    public boolean existsByWorkshopAndEmail(long workshopId, String email) {
        return dsl.fetchExists(REGISTRATION,
                REGISTRATION.WORKSHOP_ID.eq(workshopId).and(REGISTRATION.PARTICIPANT_EMAIL.equalIgnoreCase(email)));
    }

    public void insert(long workshopId, String name, String email, LocalDateTime registeredAt) {
        dsl.insertInto(REGISTRATION)
                .set(REGISTRATION.WORKSHOP_ID, workshopId)
                .set(REGISTRATION.PARTICIPANT_NAME, name)
                .set(REGISTRATION.PARTICIPANT_EMAIL, email)
                .set(REGISTRATION.REGISTERED_AT, registeredAt)
                .execute();
    }
}
