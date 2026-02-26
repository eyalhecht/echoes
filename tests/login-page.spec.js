import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('login page displays correctly', async ({ page }) => {
    await expect(page.locator('#root')).toBeVisible();
  });

  test('google sign-in button is visible', async ({ page }) => {
    const signInButton = page.getByRole('button', { name: /continue with google/i });
    await expect(signInButton).toBeVisible();
  });

  test('page has correct branding', async ({ page }) => {
    await expect(page.getByText(/echoes/i).first()).toBeVisible();
  });

  test('no console errors on initial load', async ({ page }) => {
    const consoleErrors = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    const unexpectedErrors = consoleErrors.filter(
      (error) =>
        !error.includes('auth') &&
        !error.includes('firebase') &&
        !error.includes('Failed to fetch')
    );

    expect(unexpectedErrors).toHaveLength(0);
  });
});
