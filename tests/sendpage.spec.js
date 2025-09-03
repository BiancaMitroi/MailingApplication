import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { test, expect } from '@playwright/test';

test('send page has certain UI elements', async ({ page }) => {
    await page.goto('http://localhost:3000/send');
    await expect(page.locator('h1')).toHaveText(/Send Page/i);
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('textarea[placeholder="Add recipients manually (comma or newline separated)"]')).toBeVisible();
    await expect(page.locator('form')).toContainText('or load recipients list from file');
    await expect(page.locator('input[class="recipient-input"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Subject"]')).toBeVisible();
    await expect(page.locator('textarea[placeholder="Message"]')).toBeVisible();
    await expect(page.locator('form')).toContainText('Attachments:');
    await expect(page.locator('input[class="file-input"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toHaveText(/Send/i);
});

test('send page handles form submission', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    const email = process.env.REACT_APP_EMAIL_TEST_LOGIN;
    const password = process.env.REACT_APP_PASSWORD_TEST_LOGIN;
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    await page.goto('http://localhost:3000/send');
    await page.fill('textarea[placeholder="Add recipients manually (comma or newline separated)"]', 'biancamitroi.2001@gmail.com');
    await page.setInputFiles('input[class="recipient-input"]', 'recipients.txt');
    await page.fill('input[placeholder="Subject"]', 'Test Subject');
    await page.fill('textarea[placeholder="Message"]', 'Test Message');
    await page.setInputFiles('input[class="file-input"]', 'test.txt');
    await page.click('button[type="submit"]');
    const errors = page.locator('.error');
    await expect(errors.nth(1)).toHaveText('Mail subject is valid.');
    await expect(errors.nth(2)).toHaveText('Mail message is valid.');
    await expect(errors.nth(3)).toHaveText('All files are good.');
    await expect(errors.nth(0)).toHaveText('Email sent successfully.');
    
});