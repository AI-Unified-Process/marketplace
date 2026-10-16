<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# test-case.spec.ts

The source file `test-case.spec.ts`, wrapped in Markdown so that every skill host installs it.
Use the content of the code block below; a copy written to disk takes the name `test-case.spec.ts`.

```typescript
// Template: end-to-end journey of one test case — one test, one test.step per Flow row.
// File name: TC-XXX-<slug>.spec.ts in the E2E test folder of docs/architecture/development.md.
import { test, expect } from '@playwright/test';

test.describe('TC-001: Clerk registers a guest and books a room for them', () => {
    // Postconditions: the reservation before the guest it belongs to. Illustrative routes —
    // use the API the backend actually exposes, or the UI; never a delete-all.
    test.afterEach(async ({ request }) => {
        await request.delete('/api/reservations?guestEmail=mia.keller%40example.com');
        await request.delete('/api/guests?email=mia.keller%40example.com');
    });

    test('journey', { tag: '@TC-001' }, async ({ page }) => {
        // Step 1: Register guest
        await test.step('Step 1: Register guest', async () => {
            await page.goto('/guests/new');
            await page.getByLabel('Full Name').fill('Mia Keller');
            await page.getByLabel('Email').fill('mia.keller@example.com');
            await page.getByRole('button', { name: 'Register' }).click();
        });

        // Step 2: Verify guest is listed
        await test.step('Step 2: Verify guest is listed', async () => {
            await page.getByRole('link', { name: 'Guests' }).click();
            await expect(page.getByRole('heading', { name: 'Guests' })).toBeVisible();
            await expect(page.getByRole('row', { name: /Mia Keller/ })).toBeVisible();
        });

        // Step 3: Book room
        await test.step('Step 3: Book room', async () => {
            await page.getByRole('link', { name: 'Reservations' }).click();
            await page.getByRole('button', { name: 'New Reservation' }).click();
            await page.getByLabel('Guest').selectOption('Mia Keller');
            await page.getByLabel('Room Type').selectOption('Deluxe Suite');
            await page.getByRole('button', { name: 'Confirm' }).click();
        });

        // Validation 1: Reservation confirmed
        await expect(page.getByText('Reservation confirmed')).toBeVisible();
    });
});
```
