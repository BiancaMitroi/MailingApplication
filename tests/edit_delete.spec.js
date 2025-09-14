import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { test, expect } from '@playwright/test';

test('edit page has certain UI elements', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    const email = process.env.REACT_APP_EMAIL_TEST_LOGIN;
    const password = process.env.REACT_APP_PASSWORD_TEST_LOGIN;
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    await page.goto('http://localhost:3000/edit');
    await expect(page.locator('h1')).toHaveText(/Edit Profile/i);
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('input[placeholder="First Name"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Last Name"]')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[placeholder="New Password (leave blank to keep current)"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Confirm New Password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toHaveText(/Save Changes/i);
});

test('edit page updates profile when valid data is entered', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    const email = process.env.REACT_APP_EMAIL_TEST_LOGIN;
    const password = process.env.REACT_APP_PASSWORD_TEST_LOGIN;
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    const firstName = process.env.REACT_APP_FIRSTNAME_TEST_EDIT;
    const lastName = process.env.REACT_APP_LASTNAME_TEST_EDIT;
    await page.goto('http://localhost:3000/edit');
    await page.fill('input[placeholder="First Name"]', firstName);
    await page.fill('input[placeholder="Last Name"]', lastName);
    await page.fill('input[type="email"]', email);
    await page.click('button[type="submit"]');
    await expect(page.locator('.success')).toHaveText(/Profile updated successfully!/i);
});

test('delete page has confirmation and buttons', async ({ page }) => {
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
    await page.goto('http://localhost:3000/login');
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    await page.goto('http://localhost:3000/delete');
    await expect(page.locator('h1')).toHaveText(/Delete Account/i);
    await expect(page.locator('p')).toHaveText(/Are you sure you want to delete your account/i);
    await expect(page.locator('button')).toHaveCount(2);
    await expect(page.locator('button').nth(0)).toHaveText(/Yes/i);
    await expect(page.locator('button').nth(1)).toHaveText(/No/i);
});

test('delete page deletes account and redirects on Yes', async ({ page }) => {
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
    await page.goto('http://localhost:3000/login');
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    await page.goto('http://localhost:3000/delete');
    await page.click('button:has-text("Yes")');
    // Optionally check for redirect to home
    await expect(page).toHaveURL('http://localhost:3000/');
});

test('delete page cancels and redirects on No', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    const email = process.env.REACT_APP_EMAIL_TEST_LOGIN;
    const password = process.env.REACT_APP_PASSWORD_TEST_LOGIN;
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    await page.goto('http://localhost:3000/delete');
    await page.click('button:has-text("No")');
    // Optionally check for redirect to home
    await expect(page).toHaveURL('http://localhost:3000/');
});