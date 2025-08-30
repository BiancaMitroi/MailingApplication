import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { test, expect } from '@playwright/test';

test('login page has certain UI elements', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await expect(page.locator('h1')).toHaveText(/Login Page/i);
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toHaveText(/Login/i);
});

test('login page throws error in case the email or password are invalid', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    await expect(page.locator('.error')).toHaveText(/Invalid email or password/i);
});

test('login page logs the user when the credentials are valid', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    const email = process.env.REACT_APP_EMAIL_TEST_LOGIN;
    const password = process.env.REACT_APP_PASSWORD_TEST_LOGIN;
    console.log(email);
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');
    await expect(page.locator('.error')).toHaveText(/Now you are logged in./i);
});
