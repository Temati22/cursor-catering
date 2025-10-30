import { test, expect } from '@playwright/test';

test('homepage loads correctly', async ({ page }) => {
  await page.goto('/');
  
  // Check if the page title is correct
  await expect(page).toHaveTitle(/Hi-Catering/);
  
  // Check if main elements are present
  await expect(page.locator('h1')).toBeVisible();
  
  // Check if header logo is present (more specific selector)
  await expect(page.locator('header span:has-text("Hi-Catering")')).toBeVisible();
  
  // Take a screenshot
  await page.screenshot({ path: 'tests/screenshots/homepage.png' });
});

test('navigation works', async ({ page }) => {
  await page.goto('/');
  
  // Test navigation to about page (desktop only)
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.click('text=О нас');
  await expect(page).toHaveURL(/.*about/);
  
  await page.goBack();
  
  // Test navigation to contacts page
  await page.click('text=Контакты');
  await expect(page).toHaveURL(/.*contacts/);
});

test('responsive design', async ({ page }) => {
  // Test desktop view
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('/');
  await page.screenshot({ path: 'tests/screenshots/desktop.png' });
  
  // Test mobile view
  await page.setViewportSize({ width: 375, height: 667 });
  await page.screenshot({ path: 'tests/screenshots/mobile.png' });
  
  // Check if mobile menu button is visible on mobile
  await expect(page.locator('button[aria-label="Открыть меню"]')).toBeVisible();
});

test('phone number is clickable', async ({ page }) => {
  await page.goto('/');
  
  // Check if phone number link in header is present and clickable
  const headerPhoneLink = page.locator('header a[href="tel:+79999999999"]').first();
  await expect(headerPhoneLink).toBeVisible();
  await expect(headerPhoneLink).toContainText('+7 999 999 99 99');
});

test('logo navigation works', async ({ page }) => {
  await page.goto('/about');
  
  // Click on logo to go back to homepage (more specific selector)
  await page.click('header span:has-text("Hi-Catering")');
  await expect(page).toHaveURL('/');
});
