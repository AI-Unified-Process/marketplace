package com.grandhotel.app;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(auth -> auth
                        .requestMatchers("/actuator/health", "/actuator/info").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/availability/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/guests/register").permitAll()
                        .requestMatchers("/api/payments/webhook").permitAll()
                        .requestMatchers("/api/me/**").hasRole("GUEST")
                        .requestMatchers("/api/front-desk/**").hasAnyRole("RECEPTIONIST", "MANAGER")
                        .requestMatchers("/api/housekeeping/**").hasAnyRole("HOUSEKEEPER", "SUPERVISOR")
                        .requestMatchers("/api/billing/**").hasAnyRole("ACCOUNTANT", "MANAGER")
                        .requestMatchers("/api/admin/**").hasRole("MANAGER")
                        .anyRequest().authenticated())
                .oauth2ResourceServer(o -> o.jwt(jwt -> {}))
                .csrf(c -> c.ignoringRequestMatchers("/api/payments/webhook"));
        return http.build();
    }
}
