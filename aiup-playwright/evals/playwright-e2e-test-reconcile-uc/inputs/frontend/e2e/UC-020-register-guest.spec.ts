import { test, expect } from '@playwright/test';

test.describe('UC-020: Register Guest', () => {
    test('main scenario - registers a guest', async ({ page }) => {
        await page.goto('/guests/new');
        await page.locator('#firstName').fill('Lena');
        await page.locator('#lastName').fill('Brunner');
        await page.locator('#email').fill('lena.brunner@example.com');
        await page.locator('.btn-primary').click();
        await page.waitForTimeout(1000);
        await expect(page.getByText('Guest saved')).toBeVisible();
    });
});
