import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { GuestService } from '../../services/guest';
import { ReservationService } from '../../services/reservation';

/** UC-030: Book Room */
@Component({
    selector: 'app-book-room',
    imports: [ReactiveFormsModule, RouterLink],
    templateUrl: './book-room.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookRoom {
    private readonly fb = inject(FormBuilder);
    private readonly reservationService = inject(ReservationService);

    guests = toSignal(inject(GuestService).list(), { initialValue: [] });
    roomTypes = toSignal(this.reservationService.roomTypes(), { initialValue: [] });

    form = this.fb.nonNullable.group({
        guestId: [0, Validators.min(1)],
        roomTypeId: [0, Validators.min(1)],
        arrival: ['', Validators.required],
        departure: ['', Validators.required],
    });

    confirmation = signal<string | null>(null);
    errorMessage = signal<string | null>(null);

    submit(): void {
        this.form.markAllAsTouched();
        if (this.form.invalid) {
            return;
        }
        this.reservationService.book(this.form.getRawValue()).subscribe({
            next: () => {
                this.errorMessage.set(null);
                this.confirmation.set('Reservation confirmed.');
            },
            error: (e: HttpErrorResponse) => {
                this.confirmation.set(null);
                this.errorMessage.set(e.error?.detail ?? 'Booking failed.');
            },
        });
    }
}
