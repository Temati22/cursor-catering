import { test, expect } from '@playwright/test';

test('Generate test code for homepage', async ({ page }) => {
  await page.goto('/');
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  
  // Take screenshot
  await page.screenshot({ path: 'tests/screenshots/homepage-generated.png' });
  
  // Get page title
  const title = await page.title();
  console.log('Page title:', title);
  
  // Get all links
  const links = await page.locator('a').all();
  console.log(`Found ${links.length} links on the page`);
  
  // Get all buttons
  const buttons = await page.locator('button').all();
  console.log(`Found ${buttons.length} buttons on the page`);
  
  // Get all form inputs
  const inputs = await page.locator('input').all();
  console.log(`Found ${inputs.length} input fields on the page`);
  
  // Check for specific elements
  const hasLogo = await page.locator('text=Hi-Catering').count() > 0;
  const hasNavigation = await page.locator('nav').count() > 0;
  const hasFooter = await page.locator('footer').count() > 0;
  
  console.log('Page structure:');
  console.log('- Has logo:', hasLogo);
  console.log('- Has navigation:', hasNavigation);
  console.log('- Has footer:', hasFooter);
  
  // Verify basic page structure
  expect(title).toContain('Hi-Catering');
  expect(hasLogo).toBe(true);
  expect(hasNavigation).toBe(true);
  expect(hasFooter).toBe(true);
  
  console.log('✅ Homepage analysis completed');
});

test('Generate test code for any page', async ({ page, browserName }) => {
  const pages = ['/about', '/contacts', '/dishes', '/menus'];
  
  for (const pagePath of pages) {
    await page.goto(pagePath);
    await page.waitForLoadState('networkidle');
    
    const title = await page.title();
    const url = page.url();
    
    console.log(`\n📄 Page: ${pagePath}`);
    console.log(`   Title: ${title}`);
    console.log(`   URL: ${url}`);
    
    // Take screenshot
    await page.screenshot({ 
      path: `tests/screenshots/generated-${pagePath.replace('/', '')}-${browserName}.png` 
    });
    
    // Basic checks
    const hasContent = await page.locator('body').isVisible();
    const hasHeader = await page.locator('header').count() > 0;
    const hasFooter = await page.locator('footer').count() > 0;
    
    expect(hasContent).toBe(true);
    expect(hasHeader).toBe(true);
    expect(hasFooter).toBe(true);
    
    console.log(`   ✅ Page ${pagePath} loaded successfully`);
  }
  
  console.log('\n✅ All pages analyzed successfully');
});
