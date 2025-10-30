import { test, expect } from '@playwright/test';

test('UI components showcase', async ({ page }) => {
  await page.goto('/components-showcase');
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  
  // Take full page screenshot
  await page.screenshot({ 
    path: 'tests/screenshots/components-showcase-full.png',
    fullPage: true 
  });
  
  // Check if page has content
  await expect(page.locator('body')).toBeVisible();
  
  console.log('✅ Components showcase page loaded successfully');
});

test('CTA components showcase', async ({ page }) => {
  await page.goto('/cta-showcase');
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  
  // Take full page screenshot
  await page.screenshot({ 
    path: 'tests/screenshots/cta-showcase-full.png',
    fullPage: true 
  });
  
  // Check if page has content
  await expect(page.locator('body')).toBeVisible();
  
  console.log('✅ CTA showcase page loaded successfully');
});

test('Popup functionality', async ({ page }) => {
  await page.goto('/popup-test');
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  
  // Take screenshot before popup
  await page.screenshot({ path: 'tests/screenshots/popup-before.png' });
  
  // Look for popup trigger buttons (excluding mobile menu button)
  const popupButtons = page.locator('button:not([aria-label="Открыть меню"])');
  const buttonCount = await popupButtons.count();
  
  if (buttonCount > 0) {
    // Click first visible button to trigger popup
    await popupButtons.first().click();
    
    // Wait a bit for popup to appear
    await page.waitForTimeout(500);
    
    // Take screenshot after popup
    await page.screenshot({ path: 'tests/screenshots/popup-after.png' });
  } else {
    console.log('No popup buttons found on the page');
  }
  
  console.log('✅ Popup test completed');
});

test('Form interactions', async ({ page }) => {
  await page.goto('/contacts');
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  
  // Look for form elements
  const inputs = page.locator('input');
  const textareas = page.locator('textarea');
  const buttons = page.locator('button[type="submit"]');
  
  const inputCount = await inputs.count();
  const textareaCount = await textareas.count();
  const buttonCount = await buttons.count();
  
  console.log(`Found ${inputCount} inputs, ${textareaCount} textareas, ${buttonCount} submit buttons`);
  
  // Take screenshot of form
  await page.screenshot({ path: 'tests/screenshots/contacts-form.png' });
  
  // Try to fill form if elements exist
  if (inputCount > 0) {
    await inputs.first().fill('Test User');
  }
  
  if (textareaCount > 0) {
    await textareas.first().fill('This is a test message');
  }
  
  // Take screenshot after filling
  await page.screenshot({ path: 'tests/screenshots/contacts-form-filled.png' });
  
  console.log('✅ Form interaction test completed');
});

test('Debug page inspection', async ({ page }) => {
  await page.goto('/debug');
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  
  // Take full page screenshot
  await page.screenshot({ 
    path: 'tests/screenshots/debug-page.png',
    fullPage: true 
  });
  
  // Check if page has content
  await expect(page.locator('body')).toBeVisible();
  
  console.log('✅ Debug page loaded successfully');
});
