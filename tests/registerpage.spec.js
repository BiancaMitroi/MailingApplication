import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import {test, expect} from '@playwright/test';

test('register page has certain UI elements', async ({ page }) => {
    await page.goto('http://localhost:3000/register');
    await expect(page.locator('h1')).toHaveText(/Register Page/i);
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('input[placeholder="First Name"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Last Name"]')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Password"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Confirm Password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toHaveText(/Register/i);
});

test('register page throws error in case the email is already taken', async ({ page }) => {
    const email = process.env.REACT_APP_EMAIL_TEST_REGISTER;
    const password = process.env.REACT_APP_PASSWORD_TEST_REGISTER;
    const firstName = process.env.REACT_APP_FIRSTNAME_TEST_REGISTER;
    const lastName = process.env.REACT_APP_LASTNAME_TEST_REGISTER;
    await page.goto('http://localhost:3000/register');
    await page.fill('input[placeholder="First Name"]', firstName);
    await page.fill('input[placeholder="Last Name"]', lastName);
    await page.fill('input[type="email"]', email);
    await page.fill('input[placeholder="Password"]', password);
    await page.fill('input[placeholder="Confirm Password"]', password);
    await page.click('button[type="submit"]');
    await expect(page.locator('.error')).toHaveText(/An account with this email already exists./i);
});

test('register page registers the user when the credentials are valid', async ({ page }) => {
    const email = process.env.REACT_APP_EMAIL_TEST_NEW_REGISTER;
    const password = process.env.REACT_APP_PASSWORD_TEST_NEW_REGISTER;
    const firstName = process.env.REACT_APP_FIRSTNAME_TEST_NEW_REGISTER;
    const lastName = process.env.REACT_APP_LASTNAME_TEST_NEW_REGISTER;
    await page.goto('http://localhost:3000/register');
    await page.fill('input[placeholder="First Name"]', firstName);
    await page.fill('input[placeholder="Last Name"]', lastName);
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);
    await page.fill('input[placeholder="Confirm Password"]', password);
    await page.click('button[type="submit"]');
    await expect(page.locator('.error')).toHaveText(/Registration successful! You can now log in./i);
});
