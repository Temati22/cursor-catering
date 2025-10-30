'use strict';

const { createStrapi, compileStrapi } = require('@strapi/strapi');

async function testAPI() {
  const appContext = await compileStrapi();
  const strapi = await createStrapi(appContext).load();

  try {
    console.log('🧪 Testing API access...\n');

    // Test categories
    console.log('📂 Testing categories...');
    const categories = await strapi.query('api::category.category').findMany({
      filters: { publishedAt: { $notNull: true } }
    });
    console.log(`Found ${categories.length} published categories`);

    // Test dishes
    console.log('🍽️ Testing dishes...');
    const dishes = await strapi.query('api::dish.dish').findMany({
      filters: { publishedAt: { $notNull: true } }
    });
    console.log(`Found ${dishes.length} published dishes`);

    // Test menus
    console.log('📋 Testing menus...');
    const menus = await strapi.query('api::menu.menu').findMany({
      filters: { publishedAt: { $notNull: true } }
    });
    console.log(`Found ${menus.length} published menus`);

    // Test event pages
    console.log('🎉 Testing event pages...');
    const eventPages = await strapi.query('api::event-page.event-page').findMany({
      filters: { publishedAt: { $notNull: true } }
    });
    console.log(`Found ${eventPages.length} published event pages`);

    // Test global
    console.log('⚙️ Testing global...');
    const global = await strapi.query('api::global.global').findMany({
      filters: { publishedAt: { $notNull: true } }
    });
    console.log(`Found ${global.length} published global settings`);

    // Test contacts
    console.log('📞 Testing contacts...');
    const contacts = await strapi.query('api::contacts.contacts').findMany({
      filters: { publishedAt: { $notNull: true } }
    });
    console.log(`Found ${contacts.length} published contacts`);

    console.log('\n✅ API test completed!');

  } catch (error) {
    console.error('❌ Error testing API:', error);
  } finally {
    await strapi.destroy();
  }
}

testAPI();
