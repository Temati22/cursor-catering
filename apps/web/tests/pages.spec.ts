import { test, expect } from '@playwright/test';

test('components showcase page loads', async ({ page }) => {
  await page.goto('/components-showcase');
  
  // Check if page loads correctly (using default template)
  await expect(page).toHaveTitle(/.*Modern SEO Marketing Site/);
  
  // Take screenshot
  await page.screenshot({ path: 'tests/screenshots/components-showcase.png' });
});

test('dishes page loads', async ({ page }) => {
  await page.goto('/dishes');
  
  // Check if page loads correctly (using default template)
  await expect(page).toHaveTitle(/.*Modern SEO Marketing Site/);
  
  // Take screenshot
  await page.screenshot({ path: 'tests/screenshots/dishes.png' });
});

test('menus page loads', async ({ page }) => {
  await page.goto('/menus');
  
  // Check if page loads correctly (using default template)
  await expect(page).toHaveTitle(/.*Modern SEO Marketing Site/);
  
  // Take screenshot
  await page.screenshot({ path: 'tests/screenshots/menus.png' });
});

test('about page loads', async ({ page }) => {
  await page.goto('/about');
  
  // Check if page loads correctly (using default template)
  await expect(page).toHaveTitle(/.*Modern SEO Marketing Site/);
  
  // Take screenshot
  await page.screenshot({ path: 'tests/screenshots/about.png' });
});

test('contacts page loads', async ({ page }) => {
  await page.goto('/contacts');
  
  // Check if page loads correctly (using default template)
  await expect(page).toHaveTitle(/.*Modern SEO Marketing Site/);
  
  // Take screenshot
  await page.screenshot({ path: 'tests/screenshots/contacts.png' });
});
