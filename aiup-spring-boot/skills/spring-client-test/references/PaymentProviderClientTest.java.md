<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# PaymentProviderClientTest.java

The source file `PaymentProviderClientTest.java`, wrapped in Markdown so that every skill host installs it.
Use the content of the code block below; a copy written to disk takes the name `PaymentProviderClientTest.java`.

It tests the adapter `PaymentProviderRestClient` of `/spring-client` for UC-007 against the provider's operation
`createCharge` (`POST /charges`), which answers `201` with the charge, `402` with the code `card_declined` when the
card is declined (A2), and — like any remote system — may not answer at all (A3).

```java
package com.example.hotel.client.paymentprovider;

import com.example.hotel.business.booking.DepositCharge;
import com.example.hotel.business.booking.PaymentConfirmation;
import com.example.hotel.business.booking.PaymentDeclinedException;
import com.example.hotel.business.booking.PaymentProviderUnavailableException;
import com.example.hotel.usecase.UseCase;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.Instant;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.content;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.header;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withException;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withStatus;

// No Spring context: the adapter is built on a RestClient.Builder bound to MockRestServiceServer, so no request
// leaves the JVM.
class PaymentProviderClientTest {

    private static final String BASE_URL = "https://payments.test";

    private MockRestServiceServer server;
    private PaymentProviderRestClient client;

    private final DepositCharge charge = new DepositCharge(42L, new BigDecimal("150.00"), "CHF", "tok_visa_4242");

    @BeforeEach
    void setUp() {
        RestClient.Builder builder = RestClient.builder();
        server = MockRestServiceServer.bindTo(builder).build();
        client = new PaymentProviderRestClient(builder, new PaymentProviderProperties(BASE_URL, "test-api-key"));
    }

    @Test
    @UseCase(id = "UC-007")
    void charges_the_deposit_as_the_contract_describes() {
        // Request and response from the contract's createCharge example; property names as the contract spells them.
        server.expect(requestTo(BASE_URL + "/charges"))
                .andExpect(method(HttpMethod.POST))
                .andExpect(header("Authorization", "Bearer test-api-key"))
                .andExpect(content().json("""
                        {"reference": "42", "amount": "150.00", "currency": "CHF", "source": "tok_visa_4242"}
                        """, true))
                .andRespond(withStatus(HttpStatus.CREATED)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body("""
                                {"id": "ch_3NxP", "status": "succeeded", "created_at": "2026-03-01T10:00:00Z"}
                                """));

        PaymentConfirmation confirmation = client.charge(charge);

        assertThat(confirmation.chargeId()).isEqualTo("ch_3NxP");
        assertThat(confirmation.chargedAt()).isEqualTo(Instant.parse("2026-03-01T10:00:00Z"));
        server.verify();
    }

    @Test
    @UseCase(id = "UC-007", scenario = "A2: Payment Declined")
    void a_declined_card_is_the_payment_declined_flow() {
        server.expect(requestTo(BASE_URL + "/charges"))
                .andRespond(withStatus(HttpStatus.PAYMENT_REQUIRED)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body("""
                                {"code": "card_declined", "message": "Your card was declined."}
                                """));

        // The message is the specification's, never the provider's text.
        assertThatThrownBy(() -> client.charge(charge))
                .isInstanceOf(PaymentDeclinedException.class)
                .hasMessage("The payment was declined. Please use another card.");
    }

    @Test
    @UseCase(id = "UC-007", scenario = "A3: Payment Provider Unavailable")
    void no_answer_is_the_provider_unavailable_flow() {
        // An I/O error stands in for a refused connection or a read timeout; RestClient reports both as
        // ResourceAccessException, which the adapter maps.
        server.expect(requestTo(BASE_URL + "/charges"))
                .andRespond(withException(new IOException("read timed out")));

        assertThatThrownBy(() -> client.charge(charge))
                .isInstanceOf(PaymentProviderUnavailableException.class)
                .hasMessage("The payment service is not available. Please try again later.");
    }
}
```
