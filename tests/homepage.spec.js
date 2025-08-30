import { test, expect } from '@playwright/test';

test('homepage has certain UI elements', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await expect(page.locator('.navbar-brand')).toHaveText('MyApp');
    await expect(page.locator('.navbar-menu')).toHaveText('LoginLogoutRegisterCheckSend');
    await expect(page.locator('h1')).toHaveText(/Welcome to the Home Page/i);
    await expect(page.locator('p')).toHaveText(/This application is a secure mailing platform that allows users to register, log in, send emails with attachments, and validate email addresses and file safety. It includes features for checking if recipients have accounts, scanning attachments and links for threats, and ensures only authenticated users can access the mail sending function./i);
});

test('homepage has a functioning home button', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.click('text=MyApp');
    await expect(page).toHaveURL('http://localhost:3000/');
});

test('homepage has a functioning login button', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.click('text=Login');
    await expect(page).toHaveURL('http://localhost:3000/login');
});

test('homepage has a functioning register button', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.click('text=Register');
    await expect(page).toHaveURL('http://localhost:3000/register');
});

test('homepage has a functioning logout button', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.click('text=Logout');
    await expect(page).toHaveURL('http://localhost:3000/logout');
});

test('homepage has a functioning check button', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.click('text=Check');
    await expect(page).toHaveURL('http://localhost:3000/check');
});

test('homepage has a functioning send button', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.click('text=Send');
    await expect(page).toHaveURL('http://localhost:3000/send');
});