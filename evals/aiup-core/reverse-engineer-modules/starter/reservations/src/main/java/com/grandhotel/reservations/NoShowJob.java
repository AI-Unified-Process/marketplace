package com.grandhotel.reservations;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/** Part of the night audit: reservations whose arrival day has passed without check-in become no-shows. */
@Component
public class NoShowJob {

    private final JdbcClient jdbc;

    public NoShowJob(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    @Scheduled(cron = "${pms.night-audit.cron}")
    public void markNoShows() {
        jdbc.sql("UPDATE reservation SET status = 'NO_SHOW' WHERE status = 'BOOKED' AND arrival < current_date")
                .update();
    }
}
