const { createStrapi } = require('@strapi/strapi');

async function fixPermissions() {
  const strapi = await createStrapi({
    appDir: process.cwd(),
    distDir: './dist',
  });

  try {
    
    console.log('🔧 Настройка прав доступа...');
    
    // Настройка прав для Public роли
    const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
      where: { type: 'public' }
    });

    if (publicRole) {
      console.log('✅ Найдена Public роль');
      
      // Список всех API endpoints для настройки
      const apiEndpoints = [
        'api::global.global.find',
        'api::global.global.findOne',
        'api::category.category.find',
        'api::category.category.findOne',
        'api::dish.dish.find',
        'api::dish.dish.findOne',
        'api::menu.menu.find',
        'api::menu.menu.findOne',
        'api::event-page.event-page.find',
        'api::event-page.event-page.findOne',
        'api::about.about.find',
        'api::about.about.findOne',
        'api::contacts.contacts.find',
        'api::contacts.contacts.findOne',
        'api::service.service.find',
        'api::service.service.findOne',
        'api::marketing-banner.marketing-banner.find',
        'api::marketing-banner.marketing-banner.findOne',
        'api::order.order.create',
        'api::order.order.find',
        'api::order.order.findOne'
      ];

      for (const endpoint of apiEndpoints) {
        // Проверяем, существует ли уже разрешение
        const existingPermission = await strapi.query('plugin::users-permissions.permission').findOne({
          where: { 
            action: endpoint,
            role: publicRole.id 
          }
        });

        if (!existingPermission) {
          await strapi.query('plugin::users-permissions.permission').create({
            data: {
              action: endpoint,
              subject: null,
              properties: {},
              conditions: [],
              role: publicRole.id,
            }
          });
          console.log(`✅ Создано разрешение для ${endpoint}`);
        } else {
          console.log(`ℹ️  Разрешение для ${endpoint} уже существует`);
        }
      }
    } else {
      console.log('❌ Public роль не найдена');
    }

    console.log('✅ Настройка прав доступа завершена');
    
  } catch (error) {
    console.error('❌ Ошибка при настройке прав:', error);
  } finally {
    await strapi.destroy();
  }
}

fixPermissions();
