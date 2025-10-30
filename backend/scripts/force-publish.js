'use strict';

const { createStrapi, compileStrapi } = require('@strapi/strapi');

async function forcePublish() {
  const appContext = await compileStrapi();
  const strapi = await createStrapi(appContext).load();

  try {
    console.log('🚀 Force publishing all data...\n');

    // Publish categories
    const categories = await strapi.query('api::category.category').findMany();
    console.log(`📂 Publishing ${categories.length} categories...`);
    for (const category of categories) {
      await strapi.entityService.update('api::category.category', category.id, {
        data: { publishedAt: new Date() }
      });
    }

    // Publish dishes
    const dishes = await strapi.query('api::dish.dish').findMany();
    console.log(`🍽️ Publishing ${dishes.length} dishes...`);
    for (const dish of dishes) {
      await strapi.entityService.update('api::dish.dish', dish.id, {
        data: { publishedAt: new Date() }
      });
    }

    // Publish menus
    const menus = await strapi.query('api::menu.menu').findMany();
    console.log(`📋 Publishing ${menus.length} menus...`);
    for (const menu of menus) {
      await strapi.entityService.update('api::menu.menu', menu.id, {
        data: { publishedAt: new Date() }
      });
    }

    // Publish event pages
    const eventPages = await strapi.query('api::event-page.event-page').findMany();
    console.log(`🎉 Publishing ${eventPages.length} event pages...`);
    for (const page of eventPages) {
      await strapi.entityService.update('api::event-page.event-page', page.id, {
        data: { publishedAt: new Date() }
      });
    }

    // Publish global
    const global = await strapi.query('api::global.global').findMany();
    console.log(`⚙️ Publishing ${global.length} global settings...`);
    for (const g of global) {
      await strapi.entityService.update('api::global.global', g.id, {
        data: { publishedAt: new Date() }
      });
    }

    // Publish contacts
    const contacts = await strapi.query('api::contacts.contacts').findMany();
    console.log(`📞 Publishing ${contacts.length} contacts...`);
    for (const contact of contacts) {
      await strapi.entityService.update('api::contacts.contacts', contact.id, {
        data: { publishedAt: new Date() }
      });
    }

    console.log('\n✅ All data force published successfully!');

  } catch (error) {
    console.error('❌ Error force publishing data:', error);
  } finally {
    await strapi.destroy();
  }
}

forcePublish();
