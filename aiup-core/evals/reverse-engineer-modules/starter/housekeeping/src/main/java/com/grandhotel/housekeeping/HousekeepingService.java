package com.grandhotel.housekeeping;

import com.grandhotel.common.BusinessException;
import com.grandhotel.housekeeping.HousekeepingController.Defect;
import com.grandhotel.housekeeping.HousekeepingController.Inspection;
import com.grandhotel.reservations.FrontDeskService.GuestCheckedOut;
import java.time.LocalDate;
import java.util.List;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionalEventListener;

@Service
public class HousekeepingService {

    static final int MAX_ROOMS_PER_HOUSEKEEPER = 14;

    private final JdbcClient jdbc;

    public HousekeepingService(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    /** Night audit: a stayover cleaning for every occupied room. */
    @Scheduled(cron = "${pms.night-audit.cron}")
    @Transactional
    public void planStayovers() {
        jdbc.sql("""
                INSERT INTO cleaning_task (room_id, task_date, kind)
                SELECT rr.room_id, current_date, 'STAYOVER' FROM reservation_room rr
                JOIN reservation x ON x.id = rr.reservation_id WHERE x.status = 'CHECKED_IN'
                ON CONFLICT (room_id, task_date) DO NOTHING""").update();
    }

    @TransactionalEventListener
    @Transactional
    public void on(GuestCheckedOut event) {
        jdbc.sql("""
                INSERT INTO cleaning_task (room_id, task_date, kind)
                SELECT room_id, current_date, 'DEPARTURE' FROM reservation_room WHERE reservation_id = ?
                ON CONFLICT (room_id, task_date) DO UPDATE SET kind = 'DEPARTURE'""")
                .param(event.reservationId()).update();
    }

    public List<TaskView> board(LocalDate date) {
        return jdbc.sql(TASKS + " WHERE t.task_date = ? ORDER BY r.floor, r.number").param(date)
                .query(TaskView.class).list();
    }

    public List<TaskView> tasksOf(String username, LocalDate date) {
        return jdbc.sql(TASKS + " WHERE t.task_date = ? AND h.username = ? ORDER BY r.floor, r.number")
                .params(date, username).query(TaskView.class).list();
    }

    @Transactional
    public void assign(long taskId, long housekeeperId) {
        boolean active = jdbc.sql("SELECT active FROM housekeeper WHERE id = ?").param(housekeeperId)
                .query(Boolean.class).single();
        if (!active) {
            throw new BusinessException("HOUSEKEEPER_INACTIVE", "Housekeeper is not active");
        }
        int assigned = jdbc.sql("SELECT count(*) FROM cleaning_task WHERE housekeeper_id = ? "
                        + "AND task_date = (SELECT task_date FROM cleaning_task WHERE id = ?)")
                .params(housekeeperId, taskId).query(Integer.class).single();
        if (assigned >= MAX_ROOMS_PER_HOUSEKEEPER) {
            throw new BusinessException("TOO_MANY_ROOMS", "A housekeeper cleans at most 14 rooms a day");
        }
        jdbc.sql("UPDATE cleaning_task SET housekeeper_id = ? WHERE id = ?").params(housekeeperId, taskId).update();
    }

    @Transactional
    public void complete(String username, long taskId) {
        int updated = jdbc.sql("""
                        UPDATE cleaning_task t SET status = 'DONE', completed_at = now()
                        FROM housekeeper h WHERE t.id = ? AND h.id = t.housekeeper_id AND h.username = ?
                          AND t.status = 'OPEN'""").params(taskId, username).update();
        if (updated == 0) {
            throw new BusinessException("NOT_YOUR_TASK", "Task is not open or not assigned to you");
        }
        jdbc.sql("UPDATE room SET status = 'CLEAN' WHERE id = (SELECT room_id FROM cleaning_task WHERE id = ?)")
                .param(taskId).update();
    }

    @Transactional
    public void inspect(String supervisor, long taskId, Inspection inspection) {
        String status = jdbc.sql("SELECT status FROM cleaning_task WHERE id = ?").param(taskId)
                .query(String.class).single();
        if (!status.equals("DONE")) {
            throw new BusinessException("NOT_CLEANED", "Only cleaned rooms can be inspected");
        }
        if (!inspection.passed() && (inspection.remarks() == null || inspection.remarks().isBlank())) {
            throw new BusinessException("REMARKS_REQUIRED", "A failed inspection needs remarks");
        }
        jdbc.sql("INSERT INTO inspection (cleaning_task_id, inspector, passed, remarks) VALUES (?, ?, ?, ?)")
                .params(taskId, supervisor, inspection.passed(), inspection.remarks()).update();
        if (inspection.passed()) {
            jdbc.sql("UPDATE room SET status = 'INSPECTED' WHERE id = (SELECT room_id FROM cleaning_task WHERE id = ?)")
                    .param(taskId).update();
        } else {
            // a failed inspection sends the room back to cleaning
            jdbc.sql("UPDATE cleaning_task SET status = 'OPEN', completed_at = NULL WHERE id = ?").param(taskId)
                    .update();
            jdbc.sql("UPDATE room SET status = 'DIRTY' WHERE id = (SELECT room_id FROM cleaning_task WHERE id = ?)")
                    .param(taskId).update();
        }
    }

    @Transactional
    public void reportDefect(String reporter, Defect defect) {
        jdbc.sql("""
                        INSERT INTO maintenance_request (room_id, reported_by, description, priority)
                        SELECT id, ?, ?, ? FROM room WHERE number = ?""")
                .params(reporter, defect.description(), defect.priority(), defect.roomNumber()).update();
        if (defect.priority().equals("URGENT")) {
            // an urgent defect takes the room out of order until it is resolved
            jdbc.sql("UPDATE room SET status = 'OUT_OF_ORDER' WHERE number = ?").param(defect.roomNumber()).update();
        }
    }

    @Transactional
    public void resolveDefect(long id) {
        jdbc.sql("UPDATE maintenance_request SET status = 'RESOLVED', resolved_at = now() WHERE id = ?").param(id)
                .update();
        jdbc.sql("""
                UPDATE room SET status = 'DIRTY' WHERE status = 'OUT_OF_ORDER'
                  AND id = (SELECT room_id FROM maintenance_request WHERE id = ?)
                  AND NOT EXISTS (SELECT 1 FROM maintenance_request m WHERE m.room_id = room.id
                                  AND m.priority = 'URGENT' AND m.status <> 'RESOLVED')""").param(id).update();
    }

    static final String TASKS = """
            SELECT t.id, r.number AS room, t.kind, t.status, h.name AS housekeeper
            FROM cleaning_task t JOIN room r ON r.id = t.room_id LEFT JOIN housekeeper h ON h.id = t.housekeeper_id""";

    public record TaskView(long id, String room, String kind, String status, String housekeeper) {
    }
}
