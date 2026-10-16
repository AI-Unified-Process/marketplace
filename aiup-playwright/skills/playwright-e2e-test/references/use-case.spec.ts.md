<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# use-case.spec.ts

The source file `use-case.spec.ts`, wrapped in Markdown so that every skill host installs it.
Use the content of the code block below; a copy written to disk takes the name `use-case.spec.ts`.

```typescript
// Template: end-to-end test of one use case.
// File name: UC-XXX-<slug>.spec.ts in the E2E test folder of docs/architecture/development.md.
import { test, expect } from '@playwright/test';

test.describe('UC-010: Browse Room Type Catalog', () => {
    test('main scenario - lists the room types', { tag: '@UC-010' }, async ({ page }) => {
        await page.goto('/room-types');

        await expect(page.getByRole('heading', { name: 'Room Types' })).toBeVisible();
        // Values from the seed data, not from what the page happens to show.
        await expect(page.getByRole('row', { name: /Deluxe Suite/ })).toBeVisible();
    });

    test('A1: Filter by Capacity', { tag: '@UC-010' }, async ({ page }) => {
        await page.goto('/room-types');

        await page.getByLabel('Minimum Capacity').fill('4');

        // The seeded rows on either side of the filter — not a row total, which other use cases' data changes.
        await expect(page.getByRole('row', { name: /Deluxe Suite/ })).toBeVisible();
        await expect(page.getByRole('row', { name: /Single Room/ })).toHaveCount(0);
    });

    test('A2: No Room Type Matches', { tag: '@UC-010' }, async ({ page }) => {
        await page.goto('/room-types');

        await page.getByLabel('Minimum Capacity').fill('99');

        await expect(page.getByText('No room types found.')).toBeVisible();
    });
});

test.describe('UC-020: Register Guest', () => {
    const lastName = 'Keller';
    const email = 'e2e.uc020@example.com';

    // Remove only what this test created; idempotent, because the test may have failed midway.
    // The GET is the list endpoint of the spring-rest Handover: a PageResponse { content, page, size,
    // totalElements }, filtered by lastName, not by email — so match the email in content. The DELETE is
    // illustrative: the Handover of a use case that only registers has none. Use the delete the backend
    // actually exposes, or remove the guest through the UI; never a raw database call or a delete-all.
    test.afterEach(async ({ request }) => {
        const response = await request.get(`/api/guests?lastName=${lastName}&size=100`);
        if (response.ok()) {
            const { content } = await response.json();
            for (const guest of content.filter((g: { email: string }) => g.email === email)) {
                await request.delete(`/api/guests/${guest.id}`);
            }
        }
    });

    test('main scenario - registers a guest', { tag: '@UC-020' }, async ({ page }) => {
        await page.goto('/guests/new');

        await page.getByLabel('First Name').fill('Mia');
        await page.getByLabel('Last Name').fill(lastName);
        await page.getByLabel('Email').fill(email);
        await page.getByLabel('Date of Birth').fill('1990-04-12');
        await page.getByRole('button', { name: 'Register' }).click();

        await expect(page.getByText('Guest registered')).toBeVisible();
    });

    test('A1: Email Already Registered', { tag: '@UC-020' }, async ({ page }) => {
        // Precondition from the seed data: anna.meier@example.com is registered.
        await page.goto('/guests/new');

        await page.getByLabel('First Name').fill('Anna');
        await page.getByLabel('Last Name').fill('Meier');
        await page.getByLabel('Email').fill('anna.meier@example.com');
        await page.getByLabel('Date of Birth').fill('1985-01-20');
        await page.getByRole('button', { name: 'Register' }).click();

        // The full message the specification states.
        await expect(page.getByRole('alert')).toHaveText('This email address is already registered.');
    });
});
```
