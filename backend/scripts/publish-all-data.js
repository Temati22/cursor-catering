'use strict';

const { createStrapi, compileStrapi } = require('@strapi/strapi');

async function publishAllData() {
  const appContext = await compileStrapi();
  const strapi = await createStrapi(appContext).load();

  try {
    console.log('🚀 Публикация всех данных...\n');

    // Publish categories
    const categories = await strapi.query('api::category.category').findMany();
    console.log(`📂 Публикация ${categories.length} категорий...`);
    for (const category of categories) {
      await strapi.documents('api::category.category').publish({
        documentId: category.documentId
      });
    }

    // Publish dishes
    const dishes = await strapi.query('api::dish.dish').findMany();
    console.log(`🍽️ Публикация ${dishes.length} блюд...`);
    for (const dish of dishes) {
      await strapi.documents('api::dish.dish').publish({
        documentId: dish.documentId
      });
    }

    // Publish menus
    const menus = await strapi.query('api::menu.menu').findMany();
    console.log(`📋 Публикация ${menus.length} меню...`);
    for (const menu of menus) {
      await strapi.documents('api::menu.menu').publish({
        documentId: menu.documentId
      });
    }

    // Publish event pages
    const eventPages = await strapi.query('api::event-page.event-page').findMany();
    console.log(`🎉 Публикация ${eventPages.length} страниц мероприятий...`);
    for (const page of eventPages) {
      await strapi.documents('api::event-page.event-page').publish({
        documentId: page.documentId
      });
    }

    // Publish services
    const services = await strapi.query('api::service.service').findMany();
    console.log(`🛎️ Публикация ${services.length} услуг...`);
    for (const service of services) {
      await strapi.documents('api::service.service').publish({
        documentId: service.documentId
      });
    }

    // Publish advantages
    const advantages = await strapi.query('api::advantage.advantage').findMany();
    console.log(`⭐ Публикация ${advantages.length} преимуществ...`);
    for (const advantage of advantages) {
      await strapi.documents('api::advantage.advantage').publish({
        documentId: advantage.documentId
      });
    }

    console.log('\n✅ Все данные успешно опубликованы!');
    console.log('\n📋 Итого опубликовано:');
    console.log(`   - Категорий: ${categories.length}`);
    console.log(`   - Блюд: ${dishes.length}`);
    console.log(`   - Меню: ${menus.length}`);
    console.log(`   - Страниц мероприятий: ${eventPages.length}`);
    console.log(`   - Услуг: ${services.length}`);
    console.log(`   - Преимуществ: ${advantages.length}`);

  } catch (error) {
    console.error('❌ Ошибка публикации данных:', error);
  } finally {
    await strapi.destroy();
  }
}

publishAllData();

