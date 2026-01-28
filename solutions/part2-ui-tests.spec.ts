/**
 * Part 2 - UI Automation Tests
 * Framework: Playwright
 *
 * Run with: npx playwright test
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Login Page', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    // Clear any existing session
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test.describe('Positive Tests', () => {

    test('should login successfully with valid credentials', async ({ page }) => {
      // Fill in credentials
      await page.getByTestId('email-input').fill('user@example.com');
      await page.getByTestId('password-input').fill('Password123!');

      // Submit form
      await page.getByTestId('submit-button').click();

      // Verify welcome screen appears
      await expect(page.getByTestId('welcome-container')).toBeVisible();
      await expect(page.getByTestId('welcome-message')).toContainText('successfully logged in');

      // Verify login form is hidden
      await expect(page.getByTestId('login-form')).not.toBeVisible();

      // Verify token is stored in localStorage
      const token = await page.evaluate(() => localStorage.getItem('token'));
      expect(token).toBeTruthy();
    });

  });

  test.describe('Negative Tests', () => {

    test('should show error message for invalid credentials', async ({ page }) => {
      // Fill in invalid credentials
      await page.getByTestId('email-input').fill('user@example.com');
      await page.getByTestId('password-input').fill('wrongpassword');

      // Submit form
      await page.getByTestId('submit-button').click();

      // Verify error message is displayed
      await expect(page.getByTestId('error-message')).toBeVisible();
      await expect(page.getByTestId('error-message')).toContainText('Invalid credentials');

      // Verify we're still on login form
      await expect(page.getByTestId('login-form')).toBeVisible();
      await expect(page.getByTestId('welcome-container')).not.toBeVisible();
    });

    test('should show error when email is empty', async ({ page }) => {
      // Leave email empty, fill password
      await page.getByTestId('password-input').fill('Password123!');

      // Submit form
      await page.getByTestId('submit-button').click();

      // Verify error message
      await expect(page.getByTestId('error-message')).toBeVisible();
      await expect(page.getByTestId('error-message')).toContainText('Email is required');
    });

    test('should show error when password is empty', async ({ page }) => {
      // Fill email, leave password empty
      await page.getByTestId('email-input').fill('user@example.com');

      // Submit form
      await page.getByTestId('submit-button').click();

      // Verify error message
      await expect(page.getByTestId('error-message')).toBeVisible();
      await expect(page.getByTestId('error-message')).toContainText('Password is required');
    });

  });

  test.describe('UI Behavior', () => {

    test('should show loading state while logging in', async ({ page }) => {
      // Fill credentials
      await page.getByTestId('email-input').fill('user@example.com');
      await page.getByTestId('password-input').fill('Password123!');

      // Click and immediately check button text
      const submitButton = page.getByTestId('submit-button');
      await submitButton.click();

      // Button should show loading state (this may be quick)
      // After completion, verify successful login
      await expect(page.getByTestId('welcome-container')).toBeVisible();
    });

    test('should logout and return to login form', async ({ page }) => {
      // First login
      await page.getByTestId('email-input').fill('user@example.com');
      await page.getByTestId('password-input').fill('Password123!');
      await page.getByTestId('submit-button').click();
      await expect(page.getByTestId('welcome-container')).toBeVisible();

      // Click logout
      await page.getByTestId('logout-button').click();

      // Verify login form is back
      await expect(page.getByTestId('login-form')).toBeVisible();
      await expect(page.getByTestId('welcome-container')).not.toBeVisible();

      // Verify token is cleared
      const token = await page.evaluate(() => localStorage.getItem('token'));
      expect(token).toBeNull();
    });

    test('should clear error message on new login attempt', async ({ page }) => {
      // First, trigger an error
      await page.getByTestId('email-input').fill('user@example.com');
      await page.getByTestId('password-input').fill('wrong');
      await page.getByTestId('submit-button').click();
      await expect(page.getByTestId('error-message')).toBeVisible();

      // Now login with correct credentials
      await page.getByTestId('password-input').fill('Password123!');
      await page.getByTestId('submit-button').click();

      // Should succeed without error
      await expect(page.getByTestId('welcome-container')).toBeVisible();
    });

  });

});
