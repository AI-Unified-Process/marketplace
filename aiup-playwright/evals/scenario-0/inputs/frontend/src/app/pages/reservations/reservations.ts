import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ReservationService } from '../../services/reservation';

/** UC-030: Book Room — the Reservations page lists the reservations. */
@Component({
    selector: 'app-reservations',
    imports: [RouterLink],
    templateUrl: './reservations.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Reservations {
    private readonly reservationService = inject(ReservationService);

    reservations = toSignal(this.reservationService.list(), { initialValue: [] });
}
