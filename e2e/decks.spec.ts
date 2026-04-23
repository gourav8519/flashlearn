import { test, expect, Page } from '@playwright/test';

function uniqueEmail() {
  return `e2e-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@test.flashlearn.app`;
}

async function signUp(page: Page) {
  const email = uniqueEmail();
  const password = 'Test1234';

  await page.goto('/signup');
  await page.getByPlaceholder(/ayush sharma|name/i).fill('Deck Tester');
  await page.getByPlaceholder(/you@example\.com|email/i).fill(email);
  await page.getByPlaceholder(/at least 6 characters/i).fill(password);
  await page.getByRole('button', { name: /create account/i }).click();
  await page.waitForURL(/\/dashboard/, { timeout: 20_000 });
}

test('logged-in user can create a new deck', async ({ page }) => {
  await signUp(page);
  await page.goto('/decks');

  const deckName = `E2E Deck ${Date.now()}`;

  await page.getByRole('button', { name: /new deck/i }).first().click();
  await page.getByPlaceholder(/biology|cell structure/i).fill(deckName);

  await page.getByRole('button', { name: /^create deck$/i }).click();

  await expect(page.getByText(deckName)).toBeVisible({ timeout: 10_000 });
});
