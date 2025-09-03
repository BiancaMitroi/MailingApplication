import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { test, expect } from '@playwright/test';

test('check page has certain UI elements', async ({ page }) => {
    await page.goto('http://localhost:3000/check');
    await expect(page.locator('h1')).toHaveText(/Check Page/i);
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('input[placeholder="Sender mail address"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Subject"]')).toBeVisible();
    await expect(page.locator('textarea[placeholder="Message"]')).toBeVisible();
    await expect(page.locator('form')).toContainText('Attachments:');
    await expect(page.locator('input[type="file"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toHaveText(/Check/i);
});

test('check when the input is invalid', async ({ page }) => {
    await page.goto('http://localhost:3000/check');
    await page.fill('input[placeholder="Sender mail address"]', 'a@gmail.com');
    await page.fill('input[placeholder="Subject"]', 'Happy http://213.21.237.96/bins/mirai.arm');
    await page.fill('textarea[placeholder="Message"]', 'Happy http://213.21.237.96/bins/mirai.arm');
    await page.setInputFiles('input[type="file"]', 'sample2.apk');
    await page.click('button[type="submit"]');
    const errors = page.locator('.error');
    await expect(errors.nth(0)).toHaveText('Invalid mail address.');
    await expect(errors.nth(1)).toHaveText('Mail subject contains: inappropriate content. (spam, fear, extreme joy) Mail subject contains malicious links: http://213.21.237.96/bins/mirai.arm');
    await expect(errors.nth(2)).toHaveText('Mail message contains: inappropriate content. (spam, fear, extreme joy) Mail message contains malicious links: http://213.21.237.96/bins/mirai.arm');
    await expect(errors.nth(3)).toHaveText('Malicious attachments found: sample2.apk');
});

test('check when the input is valid', async ({ page }) => {
    await page.goto('http://localhost:3000/check');
    const email = process.env.REACT_APP_EMAIL_TEST_LOGIN;
    await page.fill('input[placeholder="Sender mail address"]', email);
    await page.fill('input[placeholder="Subject"]', 'Mail subject');
    await page.fill('textarea[placeholder="Message"]', 'Mail message');
    await page.setInputFiles('input[type="file"]', 'test.txt');
    await page.click('button[type="submit"]');
    const errors = page.locator('.error');
    await expect(errors.nth(0)).toHaveText('The mail address is valid.');
    await expect(errors.nth(1)).toHaveText('Mail subject is valid.');
    await expect(errors.nth(2)).toHaveText('Mail message is valid.');
    await expect(errors.nth(3)).toHaveText('All files are good.');
});