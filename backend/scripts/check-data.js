'use strict';

const { createStrapi, compileStrapi } = require('@strapi/strapi');

async function checkData() {
  const appContext = await compileStrapi();
  const strapi = await createStrapi(appContext).load();

  try {
    console.log('🔍 Checking data in database...\n');

    // Check categories
    const categories = await strapi.query('api::category.category').findMany();
    console.log(`📂 Categories: ${categories.length}`);
    categories.forEach(cat => console.log(`  - ${cat.name} (${cat.slug})`));

    // Check dishes
    const dishes = await strapi.query('api::dish.dish').findMany();
    console.log(`\n🍽️ Dishes: ${dishes.length}`);
    dishes.forEach(dish => console.log(`  - ${dish.name} (${dish.price} ${dish.currency})`));

    // Check menus
    const menus = await strapi.query('api::menu.menu').findMany();
    console.log(`\n📋 Menus: ${menus.length}`);
    menus.forEach(menu => console.log(`  - ${menu.name} (${menu.pricePerPerson} ${menu.currency}/чел)`));

    // Check event pages
    const eventPages = await strapi.query('api::event-page.event-page').findMany();
    console.log(`\n🎉 Event Pages: ${eventPages.length}`);
    eventPages.forEach(page => console.log(`  - ${page.title} (${page.Slug})`));

    // Check global
    const global = await strapi.query('api::global.global').findMany();
    console.log(`\n⚙️ Global: ${global.length}`);
    global.forEach(g => console.log(`  - ${g.siteName}`));

    // Check contacts
    const contacts = await strapi.query('api::contacts.contacts').findMany();
    console.log(`\n📞 Contacts: ${contacts.length}`);
    contacts.forEach(c => console.log(`  - ${c.title || 'Contact info'}`));

    console.log('\n✅ Data check completed!');

  } catch (error) {
    console.error('❌ Error checking data:', error);
  } finally {
    await strapi.destroy();
  }
}

checkData();
