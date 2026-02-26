import { test, expect } from '@playwright/test';

const PROTECTED_ROUTES = ['/home', '/explore', '/profile', '/map', '/upload', '/bookmarks'];

test.describe('Protected Routes (unauthenticated)', () => {
  for (const route of PROTECTED_ROUTES) {
    test(`${route} redirects to landing page`, async ({ page }) => {
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL('/');
    });
  }
});
