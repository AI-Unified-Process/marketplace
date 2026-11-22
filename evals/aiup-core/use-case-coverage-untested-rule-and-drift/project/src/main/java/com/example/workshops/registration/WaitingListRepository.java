package com.example.workshops.registration;

import static com.example.workshops.db.tables.WaitingListEntry.WAITING_LIST_ENTRY;

import java.time.LocalDateTime;

import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

@Repository
public class WaitingListRepository {

    private final DSLContext dsl;

    public WaitingListRepository(DSLContext dsl) {
        this.dsl = dsl;
    }

    public void insert(long workshopId, String name, String email, LocalDateTime addedAt) {
        dsl.insertInto(WAITING_LIST_ENTRY)
                .set(WAITING_LIST_ENTRY.WORKSHOP_ID, workshopId)
                .set(WAITING_LIST_ENTRY.PARTICIPANT_NAME, name)
                .set(WAITING_LIST_ENTRY.PARTICIPANT_EMAIL, email)
                .set(WAITING_LIST_ENTRY.ADDED_AT, addedAt)
                .execute();
    }
}
