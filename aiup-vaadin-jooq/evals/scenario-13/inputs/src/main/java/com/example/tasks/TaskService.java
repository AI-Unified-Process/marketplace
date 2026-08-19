package com.example.tasks;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;
import com.vaadin.hilla.exception.EndpointException;
import org.jooq.DSLContext;
import org.jooq.Records;

import java.util.List;

import static com.example.tasks.jooq.Tables.TASK;

@BrowserCallable
@AnonymousAllowed
public class TaskService {

    private final DSLContext ctx;

    public TaskService(DSLContext ctx) {
        this.ctx = ctx;
    }

    public List<TaskDto> list() {
        return ctx.select(TASK.ID, TASK.TITLE, TASK.DUE_DATE, TASK.DONE)
                .from(TASK)
                .orderBy(TASK.DUE_DATE.asc().nullsLast(), TASK.TITLE.asc())
                .fetch(Records.mapping(TaskDto::new));
    }

    public TaskDto save(TaskDto task) {
        if (task.title() == null || task.title().isBlank()) {
            throw new EndpointException("Title is required");
        }
        boolean duplicate = ctx.fetchExists(
                ctx.selectFrom(TASK).where(TASK.TITLE.equalIgnoreCase(task.title().trim())));
        if (duplicate) {
            throw new EndpointException("A task with this title already exists");
        }
        return ctx.insertInto(TASK)
                .set(TASK.TITLE, task.title().trim())
                .set(TASK.DUE_DATE, task.dueDate())
                .set(TASK.DONE, task.done())
                .returning(TASK.ID, TASK.TITLE, TASK.DUE_DATE, TASK.DONE)
                .fetchOne(Records.mapping(TaskDto::new));
    }
}
