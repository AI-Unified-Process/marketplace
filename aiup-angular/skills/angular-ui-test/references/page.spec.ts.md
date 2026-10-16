<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# page.spec.ts

The source file `page.spec.ts`, wrapped in Markdown so that every skill host installs it.
Use the content of the code block below; a copy written to disk takes the name `page.spec.ts`.

```typescript
// Template: UI-layer test of a routed Angular page for one use case.
// File name: UC-XXX-<slug>.spec.ts, colocated with the page component.
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { environment } from '../../../environments/environment';
import { RoomTypeOverview } from './room-type-overview';

// The URL the service builds: match it whole, so a configured environment.apiBaseUrl does not break the matcher.
const ROOM_TYPES = `${environment.apiBaseUrl}/api/room-types`;

// Same shape as the API's RoomTypeDto: every field, with its real nullability.
const DELUXE = { id: 1, name: 'Deluxe Suite', description: null, capacity: 4, price: 199 };
const SINGLE = { id: 2, name: 'Single Room', description: 'Quiet side', capacity: 1, price: 89 };

describe('UC-010: Browse Room Type Catalog', () => {
    let fixture: ComponentFixture<RoomTypeOverview>;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RoomTypeOverview],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                // A non-HTTP dependency the page injects (i18n, a clock) is overridden here:
                // { provide: I18nService, useClass: MockI18nService },
            ],
        });
        httpMock = TestBed.inject(HttpTestingController);
        fixture = TestBed.createComponent(RoomTypeOverview);
        fixture.detectChanges(); // ngOnInit sends the first request
    });

    afterEach(() => {
        httpMock.verify();
    });

    function rows(): NodeListOf<HTMLTableRowElement> {
        return fixture.nativeElement.querySelectorAll('tbody tr');
    }

    it('main scenario - displays all room types with name, capacity, and price', async () => {
        const req = httpMock.expectOne((r) => r.url === ROOM_TYPES);
        expect(req.request.method).toBe('GET');
        req.flush([DELUXE, SINGLE]);
        fixture.detectChanges();
        await fixture.whenStable();

        expect(rows()).toHaveLength(2);
        expect(rows()[0].textContent).toContain('Deluxe Suite');
        expect(rows()[0].textContent).toContain('199');
    });

    it('A1: Filter by Capacity', async () => {
        httpMock.expectOne((r) => r.url === ROOM_TYPES).flush([DELUXE, SINGLE]);
        fixture.detectChanges();

        const input: HTMLInputElement = fixture.nativeElement.querySelector('input#minCapacity');
        input.value = '4';
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        const req = httpMock.expectOne((r) => r.url === ROOM_TYPES && r.params.get('minCapacity') === '4');
        req.flush([DELUXE]);
        fixture.detectChanges();
        await fixture.whenStable();

        expect(rows()).toHaveLength(1);
        expect(rows()[0].textContent).toContain('Deluxe Suite');
    });

    it('A2: No Room Type Matches - shows the empty state', async () => {
        httpMock.expectOne((r) => r.url === ROOM_TYPES).flush([]);
        fixture.detectChanges();
        await fixture.whenStable();

        // The full message the specification states, not a fragment of it.
        expect(fixture.nativeElement.textContent).toContain('No room types found.');
    });

    it('A3: Catalog Unavailable - shows the error the specification states', async () => {
        httpMock
            .expectOne((r) => r.url === ROOM_TYPES)
            .flush({ detail: 'Service unavailable' }, { status: 503, statusText: 'Service Unavailable' });
        fixture.detectChanges();
        await fixture.whenStable();

        const alert: HTMLElement = fixture.nativeElement.querySelector('[role="alert"]');
        expect(alert.textContent?.trim()).toBe('Room types could not be loaded.');
    });
});
```
