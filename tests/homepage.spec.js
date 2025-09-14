import { test, expect } from '@playwright/test';

test('homepage has certain UI elements', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await expect(page.locator('.navbar-brand')).toHaveText('MyApp');
    await expect(page.locator('.navbar-menu')).toHaveText('AccountLoginLogoutRegisterEdit profileDelete accountCheckSend');
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
    await page.selectOption('select', '/login');
    await expect(page).toHaveURL('http://localhost:3000/login');
});

test('homepage has a functioning register button', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.selectOption('select', '/register');
    await expect(page).toHaveURL('http://localhost:3000/register');
});

test('homepage has a functioning logout button', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.selectOption('select', '/logout');
    await expect(page).toHaveURL('http://localhost:3000/logout');
});

test('homepage has a functioning edit button', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    const email = process.env.REACT_APP_EMAIL_TEST_LOGIN;
    const password = process.env.REACT_APP_PASSWORD_TEST_LOGIN;
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    await page.goto('http://localhost:3000/');
    await page.selectOption('select', '/edit');
    await expect(page).toHaveURL('http://localhost:3000/edit');
});

test('homepage has a functioning delete button', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    const email = process.env.REACT_APP_EMAIL_TEST_LOGIN;
    const password = process.env.REACT_APP_PASSWORD_TEST_LOGIN;
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    await page.goto('http://localhost:3000/');
    await page.selectOption('select', '/delete');
    await expect(page).toHaveURL('http://localhost:3000/delete');
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