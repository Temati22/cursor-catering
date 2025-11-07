const { createStrapi, compileStrapi } = require('@strapi/strapi');

async function setupPermissions() {
  const appContext = await compileStrapi();
  const strapi = await createStrapi(appContext).load();

  try {
    
    // Настройка прав для Public роли
    const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
      where: { type: 'public' }
    });

    if (publicRole) {
      // Разрешаем доступ к категориям
      await strapi.query('plugin::users-permissions.permission').create({
        data: {
          action: 'api::category.category.find',
          subject: null,
          properties: {},
          conditions: [],
          role: publicRole.id,
        }
      });

      await strapi.query('plugin::users-permissions.permission').create({
        data: {
          action: 'api::category.category.findOne',
          subject: null,
          properties: {},
          conditions: [],
          role: publicRole.id,
        }
      });

      // Разрешаем доступ к блюдам
      await strapi.query('plugin::users-permissions.permission').create({
        data: {
          action: 'api::dish.dish.find',
          subject: null,
          properties: {},
          conditions: [],
          role: publicRole.id,
        }
      });

      await strapi.query('plugin::users-permissions.permission').create({
        data: {
          action: 'api::dish.dish.findOne',
          subject: null,
          properties: {},
          conditions: [],
          role: publicRole.id,
        }
      });

      // Разрешаем доступ к меню
      await strapi.query('plugin::users-permissions.permission').create({
        data: {
          action: 'api::menu.menu.find',
          subject: null,
          properties: {},
          conditions: [],
          role: publicRole.id,
        }
      });

      await strapi.query('plugin::users-permissions.permission').create({
        data: {
          action: 'api::menu.menu.findOne',
          subject: null,
          properties: {},
          conditions: [],
          role: publicRole.id,
        }
      });

      // Разрешаем доступ к глобальным настройкам
      await strapi.query('plugin::users-permissions.permission').create({
        data: {
          action: 'api::global.global.find',
          subject: null,
          properties: {},
          conditions: [],
          role: publicRole.id,
        }
      });

      await strapi.query('plugin::users-permissions.permission').create({
        data: {
          action: 'api::global.global.findOne',
          subject: null,
          properties: {},
          conditions: [],
          role: publicRole.id,
        }
      });

      // Разрешаем доступ к странице About
      await strapi.query('plugin::users-permissions.permission').create({
        data: {
          action: 'api::about.about.find',
          subject: null,
          properties: {},
          conditions: [],
          role: publicRole.id,
        }
      });

      await strapi.query('plugin::users-permissions.permission').create({
        data: {
          action: 'api::about.about.findOne',
          subject: null,
          properties: {},
          conditions: [],
          role: publicRole.id,
        }
      });

      // Разрешаем доступ к страницам мероприятий
      await strapi.query('plugin::users-permissions.permission').create({
        data: {
          action: 'api::event-page.event-page.find',
          subject: null,
          properties: {},
          conditions: [],
          role: publicRole.id,
        }
      });

      await strapi.query('plugin::users-permissions.permission').create({
        data: {
          action: 'api::event-page.event-page.findOne',
          subject: null,
          properties: {},
          conditions: [],
          role: publicRole.id,
        }
      });

      // Разрешаем доступ к контактам
      await strapi.query('plugin::users-permissions.permission').create({
        data: {
          action: 'api::contacts.contacts.find',
          subject: null,
          properties: {},
          conditions: [],
          role: publicRole.id,
        }
      });

      await strapi.query('plugin::users-permissions.permission').create({
        data: {
          action: 'api::contacts.contacts.findOne',
          subject: null,
          properties: {},
          conditions: [],
          role: publicRole.id,
        }
      });

      // Разрешаем доступ к услугам
      await strapi.query('plugin::users-permissions.permission').create({
        data: {
          action: 'api::service.service.find',
          subject: null,
          properties: {},
          conditions: [],
          role: publicRole.id,
        }
      });

      await strapi.query('plugin::users-permissions.permission').create({
        data: {
          action: 'api::service.service.findOne',
          subject: null,
          properties: {},
          conditions: [],
          role: publicRole.id,
        }
      });

      // Разрешаем доступ к галерее
      await strapi.query('plugin::users-permissions.permission').create({
        data: {
          action: 'api::gallery.gallery.find',
          subject: null,
          properties: {},
          conditions: [],
          role: publicRole.id,
        }
      });

      console.log('✅ Permissions configured successfully');
    } else {
      console.log('❌ Public role not found');
    }

  } catch (error) {
    console.error('❌ Error setting up permissions:', error);
  } finally {
    await strapi.destroy();
  }
}

setupPermissions();
