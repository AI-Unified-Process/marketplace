package com.example.workshops.workshop;

import static com.example.workshops.db.tables.Workshop.WORKSHOP;

import java.util.List;
import java.util.Optional;

import org.jooq.DSLContext;
import org.jooq.Records;
import org.springframework.stereotype.Repository;

@Repository
public class WorkshopRepository {

    private final DSLContext dsl;

    public WorkshopRepository(DSLContext dsl) {
        this.dsl = dsl;
    }

    public List<Workshop> findAll() {
        return dsl.select(WORKSHOP.ID, WORKSHOP.TITLE, WORKSHOP.STARTS_AT, WORKSHOP.CAPACITY)
                .from(WORKSHOP)
                .orderBy(WORKSHOP.STARTS_AT)
                .fetch(Records.mapping(Workshop::new));
    }

    public Optional<Workshop> findById(long id) {
        return dsl.select(WORKSHOP.ID, WORKSHOP.TITLE, WORKSHOP.STARTS_AT, WORKSHOP.CAPACITY)
                .from(WORKSHOP)
                .where(WORKSHOP.ID.eq(id))
                .fetchOptional(Records.mapping(Workshop::new));
    }

    public long insert(Workshop workshop) {
        return dsl.insertInto(WORKSHOP)
                .set(WORKSHOP.TITLE, workshop.title())
                .set(WORKSHOP.STARTS_AT, workshop.startsAt())
                .set(WORKSHOP.CAPACITY, workshop.capacity())
                .returning(WORKSHOP.ID)
                .fetchOne(WORKSHOP.ID);
    }

    public void update(Workshop workshop) {
        dsl.update(WORKSHOP)
                .set(WORKSHOP.TITLE, workshop.title())
                .set(WORKSHOP.STARTS_AT, workshop.startsAt())
                .set(WORKSHOP.CAPACITY, workshop.capacity())
                .where(WORKSHOP.ID.eq(workshop.id()))
                .execute();
    }
}
