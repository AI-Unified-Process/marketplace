import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { GuestService } from '../../services/guest';

/** UC-020: Register Guest — the Guests page lists the registered guests. */
@Component({
    selector: 'app-guests',
    imports: [RouterLink],
    templateUrl: './guests.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Guests {
    private readonly guestService = inject(GuestService);

    guests = toSignal(this.guestService.list(), { initialValue: [] });
}
