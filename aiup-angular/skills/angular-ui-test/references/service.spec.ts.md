<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# service.spec.ts

The source file `service.spec.ts`, wrapped in Markdown so that every skill host installs it.
Use the content of the code block below; a copy written to disk takes the name `service.spec.ts`.

```typescript
// Template: plain HTTP service test — URL, method, query parameters, request body.
// Lives in the use case's spec file under its own describe, or in UC-XXX-<slug>.service.spec.ts.
import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { environment } from '../../environments/environment';
import { GuestService } from './guest';
import { Guest, GuestRequest } from './guest.model';

// The URL the service builds, including a configured environment.apiBaseUrl.
const GUESTS = `${environment.apiBaseUrl}/api/guests`;

describe('UC-020: Register Guest', () => {
    describe('GuestService', () => {
        let service: GuestService;
        let httpMock: HttpTestingController;

        beforeEach(() => {
            TestBed.configureTestingModule({
                providers: [provideHttpClient(), provideHttpClientTesting()],
            });
            service = TestBed.inject(GuestService);
            httpMock = TestBed.inject(HttpTestingController);
        });

        afterEach(() => httpMock.verify());

        it('main scenario - posts the guest and returns the created guest', () => {
            const request: GuestRequest = { fullName: 'Mia Keller', email: 'mia.keller@example.com', dateOfBirth: '1990-04-12' };
            let created: Guest | undefined;

            service.register(request).subscribe((guest) => (created = guest));

            const req = httpMock.expectOne(GUESTS);
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(request);
            req.flush({ id: 7, ...request });

            expect(created).toEqual({ id: 7, ...request });
        });

        it('A1: Email Already Registered - passes the API rejection on to the caller', () => {
            let error: HttpErrorResponse | undefined;

            service
                .register({ fullName: 'Mia Keller', email: 'mia.keller@example.com', dateOfBirth: '1990-04-12' })
                .subscribe({ error: (e: HttpErrorResponse) => (error = e) });

            // The status and Problem Details body the API Handover lists for this rejection: spring-rest
            // sets type urn:problem:<exception class> and the title of its exception handler
            httpMock.expectOne(GUESTS).flush(
                {
                    type: 'urn:problem:EmailAlreadyRegisteredException',
                    title: 'Business rule violated',
                    status: 409,
                    detail: 'Email already registered',
                },
                { status: 409, statusText: 'Conflict' },
            );

            expect(error?.status).toBe(409);
            expect(error?.error.detail).toBe('Email already registered');
        });
    });
});
```
