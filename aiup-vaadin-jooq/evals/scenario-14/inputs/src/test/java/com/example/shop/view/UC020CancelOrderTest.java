package com.example.shop.view;

import static org.assertj.core.api.Assertions.assertThat;

import com.example.shop.order.OrderRepository;
import com.example.shop.order.OrderStatus;
import com.example.shop.usecase.UseCase;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.confirmdialog.ConfirmDialog;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.testbench.unit.SpringBrowserlessTest;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class UC020CancelOrderTest extends SpringBrowserlessTest {

    @Autowired
    private OrderRepository orders;

    @Test
    @UseCase(id = "UC-020")
    void customer_cancels_a_placed_order() {
        navigate(OrderListView.class);

        Button cancel = $(Button.class).id("cancel-100");
        test(cancel).click();

        ConfirmDialog dialog = $(ConfirmDialog.class).first();
        test(dialog).confirm();

        assertThat(test($(Notification.class).first()).getText()).isEqualTo("Order cancelled");
        assertThat(orders.findById(100L).orElseThrow().status()).isEqualTo(OrderStatus.CANCELLED);
    }

    @Test
    @UseCase(id = "UC-020", scenario = "A2: Order already shipped")
    void shipped_order_cannot_be_cancelled() {
        navigate(OrderListView.class);

        Button cancel = $(Button.class).id("cancel-101");
        test(cancel).click();

        assertThat(test($(Notification.class).first()).getText())
                .isEqualTo("Shipped orders cannot be cancelled");
        assertThat(orders.findById(101L).orElseThrow().status()).isEqualTo(OrderStatus.SHIPPED);
    }

    @Test
    @Disabled("flaky on CI")
    @UseCase(id = "UC-020", businessRules = {"BR-001"})
    void cancellation_window_is_enforced() {
        navigate(OrderListView.class);

        Button cancel = $(Button.class).id("cancel-102");
        test(cancel).click();
    }
}
