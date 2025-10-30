'use strict';

const { createStrapi, compileStrapi } = require('@strapi/strapi');

async function publishData() {
  const appContext = await compileStrapi();
  const strapi = await createStrapi(appContext).load();

  try {
    console.log('📢 Publishing all data...\n');

    // Publish categories
    const categories = await strapi.query('api::category.category').findMany();
    console.log(`📂 Publishing ${categories.length} categories...`);
    for (const category of categories) {
      if (!category.publishedAt) {
        await strapi.documents('api::category.category').update({
          documentId: category.id,
          data: { publishedAt: new Date() }
        });
      }
    }

    // Publish dishes
    const dishes = await strapi.query('api::dish.dish').findMany();
    console.log(`🍽️ Publishing ${dishes.length} dishes...`);
    for (const dish of dishes) {
      if (!dish.publishedAt) {
        await strapi.documents('api::dish.dish').update({
          documentId: dish.id,
          data: { publishedAt: new Date() }
        });
      }
    }

    // Publish menus
    const menus = await strapi.query('api::menu.menu').findMany();
    console.log(`📋 Publishing ${menus.length} menus...`);
    for (const menu of menus) {
      if (!menu.publishedAt) {
        await strapi.documents('api::menu.menu').update({
          documentId: menu.id,
          data: { publishedAt: new Date() }
        });
      }
    }

    // Publish event pages
    const eventPages = await strapi.query('api::event-page.event-page').findMany();
    console.log(`🎉 Publishing ${eventPages.length} event pages...`);
    for (const page of eventPages) {
      if (!page.publishedAt) {
        await strapi.documents('api::event-page.event-page').update({
          documentId: page.id,
          data: { publishedAt: new Date() }
        });
      }
    }

    // Publish global
    const global = await strapi.query('api::global.global').findMany();
    console.log(`⚙️ Publishing ${global.length} global settings...`);
    for (const g of global) {
      if (!g.publishedAt) {
        await strapi.documents('api::global.global').update({
          documentId: g.id,
          data: { publishedAt: new Date() }
        });
      }
    }

    // Publish contacts
    const contacts = await strapi.query('api::contacts.contacts').findMany();
    console.log(`📞 Publishing ${contacts.length} contacts...`);
    for (const contact of contacts) {
      if (!contact.publishedAt) {
        await strapi.documents('api::contacts.contacts').update({
          documentId: contact.id,
          data: { publishedAt: new Date() }
        });
      }
    }

    console.log('\n✅ All data published successfully!');

  } catch (error) {
    console.error('❌ Error publishing data:', error);
  } finally {
    await strapi.destroy();
  }
}

publishData();
