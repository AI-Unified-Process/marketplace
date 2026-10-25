package com.grandhotel.guests;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.security.Principal;
import java.time.LocalDate;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class GuestController {

    private final GuestService guests;
    private final LoyaltyService loyalty;

    public GuestController(GuestService guests, LoyaltyService loyalty) {
        this.guests = guests;
        this.loyalty = loyalty;
    }

    @PostMapping("/guests/register")
    @ResponseStatus(HttpStatus.CREATED)
    public GuestView register(@Valid @RequestBody Registration registration) {
        return guests.register(registration);
    }

    @GetMapping("/me/profile")
    public GuestView profile(Principal principal) {
        return guests.byEmail(principal.getName());
    }

    @PutMapping("/me/profile")
    public GuestView updateProfile(Principal principal, @Valid @RequestBody ProfileChange change) {
        return guests.updateProfile(principal.getName(), change);
    }

    @PutMapping("/me/addresses/{kind}")
    public void saveAddress(Principal principal, @PathVariable String kind, @Valid @RequestBody Address address) {
        guests.saveAddress(principal.getName(), kind, address);
    }

    @GetMapping("/me/loyalty")
    public LoyaltyService.Balance loyaltyBalance(Principal principal) {
        return loyalty.balance(principal.getName());
    }

    @PostMapping("/me/loyalty/redeem")
    public LoyaltyService.Voucher redeem(Principal principal, @Valid @RequestBody Redemption redemption) {
        return loyalty.redeem(principal.getName(), redemption.points());
    }

    @GetMapping("/front-desk/guests")
    public List<GuestView> search(@RequestParam String query) {
        return guests.search(query);
    }

    @GetMapping("/front-desk/guests/{id}")
    public GuestView guest(@PathVariable long id) {
        return guests.byId(id);
    }

    @PutMapping("/admin/guests/{id}/vip")
    public void markVip(@PathVariable long id, @RequestParam boolean vip) {
        guests.markVip(id, vip);
    }

    public record Registration(@NotBlank @Size(max = 100) String firstName,
                               @NotBlank @Size(max = 100) String lastName,
                               @NotBlank @Email String email,
                               @Size(max = 30) String phone,
                               @NotNull @Past LocalDate dateOfBirth) {
    }

    public record ProfileChange(@NotBlank String firstName, @NotBlank String lastName, @Size(max = 30) String phone) {
    }

    public record Address(@NotBlank String street,
                          @NotBlank @Size(max = 10) String postalCode,
                          @NotBlank String city,
                          @NotBlank @Pattern(regexp = "[A-Z]{2}") String country) {
    }

    public record Redemption(@Min(100) int points) {
    }

    public record GuestView(long id, String firstName, String lastName, String email, String phone, boolean vip) {
    }
}
