import { test, expect } from '@playwright/test';

function uniqueEmail() {
  return `e2e-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@test.flashlearn.app`;
}

test('landing page loads with hero and signup CTA', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/Learn/i);
  await expect(page.getByRole('link', { name: /start free/i }).first()).toBeVisible();
});

test('user can sign up and land on dashboard', async ({ page }) => {
  const email = uniqueEmail();
  const password = 'Test1234';

  await page.goto('/signup');
  await page.getByPlaceholder(/ayush sharma|name/i).fill('E2E User');
  await page.getByPlaceholder(/you@example\.com|email/i).fill(email);
  await page.getByPlaceholder(/at least 6 characters/i).fill(password);

  await page.getByRole('button', { name: /create account/i }).click();

  await page.waitForURL(/\/dashboard/, { timeout: 20_000 });
  await expect(page).toHaveURL(/\/dashboard/);
});
