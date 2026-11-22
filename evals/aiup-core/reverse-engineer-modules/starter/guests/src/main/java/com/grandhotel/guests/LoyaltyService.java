package com.grandhotel.guests;

import com.grandhotel.common.BusinessException;
import java.math.BigDecimal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LoyaltyService {

    private final JdbcClient jdbc;
    private final int pointsPerChf;
    private final int chfPer100Points;

    public LoyaltyService(JdbcClient jdbc,
                          @Value("${pms.loyalty.points-per-chf}") int pointsPerChf,
                          @Value("${pms.loyalty.redeem-chf-per-100-points}") int chfPer100Points) {
        this.jdbc = jdbc;
        this.pointsPerChf = pointsPerChf;
        this.chfPer100Points = chfPer100Points;
    }

    public Balance balance(String email) {
        return jdbc.sql("""
                        SELECT a.tier, a.points FROM loyalty_account a JOIN guest g ON g.id = a.guest_id
                        WHERE g.email = lower(?)""")
                .param(email).query(Balance.class).single();
    }

    /** Called by billing when an invoice is paid in full. */
    @Transactional
    public void earn(long guestId, BigDecimal amountPaid, String invoiceNumber) {
        int points = amountPaid.intValue() * pointsPerChf;
        long accountId = accountOf(guestId);
        jdbc.sql("INSERT INTO loyalty_transaction (loyalty_account_id, points, reason) VALUES (?, ?, ?)")
                .params(accountId, points, "Stay " + invoiceNumber).update();
        jdbc.sql("UPDATE loyalty_account SET points = points + ? WHERE id = ?").params(points, accountId).update();
        upgradeTier(accountId);
    }

    @Transactional
    public Voucher redeem(String email, int points) {
        if (points % 100 != 0) {
            throw new BusinessException("REDEEM_STEP", "Points are redeemed in steps of 100");
        }
        Balance balance = balance(email);
        if (balance.points() < points) {
            throw new BusinessException("NOT_ENOUGH_POINTS", "Not enough loyalty points");
        }
        long accountId = jdbc.sql("""
                        SELECT a.id FROM loyalty_account a JOIN guest g ON g.id = a.guest_id
                        WHERE g.email = lower(?)""").param(email).query(Long.class).single();
        jdbc.sql("INSERT INTO loyalty_transaction (loyalty_account_id, points, reason) VALUES (?, ?, 'Redemption')")
                .params(accountId, -points).update();
        jdbc.sql("UPDATE loyalty_account SET points = points - ? WHERE id = ?").params(points, accountId).update();
        return new Voucher(BigDecimal.valueOf((long) points / 100 * chfPer100Points));
    }

    private void upgradeTier(long accountId) {
        // lifetime points earned decide the tier: 10,000 Gold, 50,000 Platinum; tiers are never downgraded
        jdbc.sql("""
                UPDATE loyalty_account a SET tier = CASE
                    WHEN earned >= 50000 THEN 'PLATINUM' WHEN earned >= 10000 AND a.tier = 'SILVER' THEN 'GOLD'
                    ELSE a.tier END
                FROM (SELECT sum(points) AS earned FROM loyalty_transaction
                      WHERE loyalty_account_id = ? AND points > 0) t
                WHERE a.id = ?""").params(accountId, accountId).update();
    }

    private long accountOf(long guestId) {
        return jdbc.sql("SELECT id FROM loyalty_account WHERE guest_id = ?").param(guestId).query(Long.class).single();
    }

    public record Balance(String tier, int points) {
    }

    public record Voucher(BigDecimal valueChf) {
    }
}
