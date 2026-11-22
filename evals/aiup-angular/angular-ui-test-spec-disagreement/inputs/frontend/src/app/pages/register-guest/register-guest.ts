import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { GuestService } from '../../services/guest';

/** UC-020: Register Guest */
@Component({
    selector: 'app-register-guest',
    imports: [ReactiveFormsModule],
    templateUrl: './register-guest.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterGuest {
    private readonly fb = inject(FormBuilder);
    private readonly guestService = inject(GuestService);

    // UC-020 BR-002: A guest is registered only with a first name, a last name, and an email address.
    form = this.fb.nonNullable.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
    });

    confirmation = signal<string | null>(null);
    errorMessage = signal<string | null>(null);

    submit(): void {
        this.form.markAllAsTouched();
        if (this.form.invalid) {
            return;
        }
        this.guestService.register(this.form.getRawValue()).subscribe({
            next: () => {
                this.errorMessage.set(null);
                this.confirmation.set('Guest saved.');
                this.form.reset();
            },
            error: (e: HttpErrorResponse) => {
                this.confirmation.set(null);
                this.errorMessage.set(e.error?.detail ?? 'Registration failed.');
            },
        });
    }
}
