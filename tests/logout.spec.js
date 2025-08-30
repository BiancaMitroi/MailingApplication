import { test, expect } from '@playwright/test';

test('logout page logs the user out', async ({ page }) => {
    await page.goto('http://localhost:3000/logout');
    await expect(page.locator('h1')).toHaveText(/Logging out.../i);
    await expect(page.locator('p')).toHaveText(/You've been logged out successfully./i);
    const token = await page.evaluate(() => localStorage.getItem('authToken'));
    expect(token).toBeNull();
});
