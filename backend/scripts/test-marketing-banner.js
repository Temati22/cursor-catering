'use strict';

async function testMarketingBanner() {
  try {
    console.log('Testing Marketing Banner API...');
    
    // Test creating a marketing banner
    const testBanner = {
      title: 'Test Marketing Banner',
      text: 'This is a test marketing banner with some promotional text.',
      isActive: true,
      position: 'top',
      priority: 1,
      publishedAt: new Date()
      // image and icon are optional fields
    };

    console.log('Creating test marketing banner...');
    const createdBanner = await strapi.documents('api::marketing-banner.marketing-banner').create({
      data: testBanner
    });
    
    console.log('✅ Marketing banner created successfully:', createdBanner.id);

    // Test finding all marketing banners
    console.log('Fetching all marketing banners...');
    const allBanners = await strapi.documents('api::marketing-banner.marketing-banner').findMany();
    console.log('✅ Found marketing banners:', allBanners.length);

    // Test finding a specific marketing banner
    console.log('Fetching specific marketing banner...');
    const specificBanner = await strapi.documents('api::marketing-banner.marketing-banner').findOne({
      documentId: createdBanner.id
    });
    console.log('✅ Found specific banner:', specificBanner.title);

    // Test updating the marketing banner
    console.log('Updating marketing banner...');
    const updatedBanner = await strapi.documents('api::marketing-banner.marketing-banner').update({
      documentId: createdBanner.id,
      data: {
        text: 'Updated marketing banner text',
        priority: 2,
        // You can also add image and icon IDs here if needed
        // image: 1,
        // icon: 2
      }
    });
    console.log('✅ Marketing banner updated successfully');

    // Test deleting the marketing banner
    console.log('Deleting marketing banner...');
    await strapi.documents('api::marketing-banner.marketing-banner').delete({
      documentId: createdBanner.id
    });
    console.log('✅ Marketing banner deleted successfully');

    console.log('🎉 All tests passed! Marketing Banner API is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    throw error;
  }
}

async function main() {
  const { createStrapi, compileStrapi } = require('@strapi/strapi');

  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();

  app.log.level = 'error';

  await testMarketingBanner();
  await app.destroy();

  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
