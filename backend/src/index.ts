export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    // Настройка прав доступа для Public роли
    try {
      const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
        where: { type: 'public' }
      });

      if (publicRole) {
        // Проверяем и создаем права для категорий
        const categoryFindPermission = await strapi.query('plugin::users-permissions.permission').findOne({
          where: { 
            action: 'api::category.category.find',
            role: publicRole.id 
          }
        });

        if (!categoryFindPermission) {
          await strapi.query('plugin::users-permissions.permission').create({
            data: {
              action: 'api::category.category.find',
              subject: null,
              properties: {},
              conditions: [],
              role: publicRole.id,
            }
          });
        }

        const categoryFindOnePermission = await strapi.query('plugin::users-permissions.permission').findOne({
          where: { 
            action: 'api::category.category.findOne',
            role: publicRole.id 
          }
        });

        if (!categoryFindOnePermission) {
          await strapi.query('plugin::users-permissions.permission').create({
            data: {
              action: 'api::category.category.findOne',
              subject: null,
              properties: {},
              conditions: [],
              role: publicRole.id,
            }
          });
        }

        // Проверяем и создаем права для блюд
        const dishFindPermission = await strapi.query('plugin::users-permissions.permission').findOne({
          where: { 
            action: 'api::dish.dish.find',
            role: publicRole.id 
          }
        });

        if (!dishFindPermission) {
          await strapi.query('plugin::users-permissions.permission').create({
            data: {
              action: 'api::dish.dish.find',
              subject: null,
              properties: {},
              conditions: [],
              role: publicRole.id,
            }
          });
        }

        const dishFindOnePermission = await strapi.query('plugin::users-permissions.permission').findOne({
          where: { 
            action: 'api::dish.dish.findOne',
            role: publicRole.id 
          }
        });

        if (!dishFindOnePermission) {
          await strapi.query('plugin::users-permissions.permission').create({
            data: {
              action: 'api::dish.dish.findOne',
              subject: null,
              properties: {},
              conditions: [],
              role: publicRole.id,
            }
          });
        }

        // Проверяем и создаем права для меню
        const menuFindPermission = await strapi.query('plugin::users-permissions.permission').findOne({
          where: { 
            action: 'api::menu.menu.find',
            role: publicRole.id 
          }
        });

        if (!menuFindPermission) {
          await strapi.query('plugin::users-permissions.permission').create({
            data: {
              action: 'api::menu.menu.find',
              subject: null,
              properties: {},
              conditions: [],
              role: publicRole.id,
            }
          });
        }

        const menuFindOnePermission = await strapi.query('plugin::users-permissions.permission').findOne({
          where: { 
            action: 'api::menu.menu.findOne',
            role: publicRole.id 
          }
        });

        if (!menuFindOnePermission) {
          await strapi.query('plugin::users-permissions.permission').create({
            data: {
              action: 'api::menu.menu.findOne',
              subject: null,
              properties: {},
              conditions: [],
              role: publicRole.id,
            }
          });
        }

        // Добавляем права на создание для тестирования
        const categoryCreatePermission = await strapi.query('plugin::users-permissions.permission').findOne({
          where: { 
            action: 'api::category.category.create',
            role: publicRole.id 
          }
        });

        if (!categoryCreatePermission) {
          await strapi.query('plugin::users-permissions.permission').create({
            data: {
              action: 'api::category.category.create',
              subject: null,
              properties: {},
              conditions: [],
              role: publicRole.id,
            }
          });
        }

        const dishCreatePermission = await strapi.query('plugin::users-permissions.permission').findOne({
          where: { 
            action: 'api::dish.dish.create',
            role: publicRole.id 
          }
        });

        if (!dishCreatePermission) {
          await strapi.query('plugin::users-permissions.permission').create({
            data: {
              action: 'api::dish.dish.create',
              subject: null,
              properties: {},
              conditions: [],
              role: publicRole.id,
            }
          });
        }

        const menuCreatePermission = await strapi.query('plugin::users-permissions.permission').findOne({
          where: { 
            action: 'api::menu.menu.create',
            role: publicRole.id 
          }
        });

        if (!menuCreatePermission) {
          await strapi.query('plugin::users-permissions.permission').create({
            data: {
              action: 'api::menu.menu.create',
              subject: null,
              properties: {},
              conditions: [],
              role: publicRole.id,
            }
          });
        }

        // Проверяем и создаем права для about
        const aboutFindPermission = await strapi.query('plugin::users-permissions.permission').findOne({
          where: { 
            action: 'api::about.about.find',
            role: publicRole.id 
          }
        });

        if (!aboutFindPermission) {
          await strapi.query('plugin::users-permissions.permission').create({
            data: {
              action: 'api::about.about.find',
              subject: null,
              properties: {},
              conditions: [],
              role: publicRole.id,
            }
          });
        }

        const aboutFindOnePermission = await strapi.query('plugin::users-permissions.permission').findOne({
          where: { 
            action: 'api::about.about.findOne',
            role: publicRole.id 
          }
        });

        if (!aboutFindOnePermission) {
          await strapi.query('plugin::users-permissions.permission').create({
            data: {
              action: 'api::about.about.findOne',
              subject: null,
              properties: {},
              conditions: [],
              role: publicRole.id,
            }
          });
        }

        // Проверяем и создаем права для event-page
        const eventPageFindPermission = await strapi.query('plugin::users-permissions.permission').findOne({
          where: { 
            action: 'api::event-page.event-page.find',
            role: publicRole.id 
          }
        });

        if (!eventPageFindPermission) {
          await strapi.query('plugin::users-permissions.permission').create({
            data: {
              action: 'api::event-page.event-page.find',
              subject: null,
              properties: {},
              conditions: [],
              role: publicRole.id,
            }
          });
        }

        const eventPageFindOnePermission = await strapi.query('plugin::users-permissions.permission').findOne({
          where: { 
            action: 'api::event-page.event-page.findOne',
            role: publicRole.id 
          }
        });

        if (!eventPageFindOnePermission) {
          await strapi.query('plugin::users-permissions.permission').create({
            data: {
              action: 'api::event-page.event-page.findOne',
              subject: null,
              properties: {},
              conditions: [],
              role: publicRole.id,
            }
          });
        }

        // Проверяем и создаем права для services
        const serviceFindPermission = await strapi.query('plugin::users-permissions.permission').findOne({
          where: { 
            action: 'api::service.service.find',
            role: publicRole.id 
          }
        });

        if (!serviceFindPermission) {
          await strapi.query('plugin::users-permissions.permission').create({
            data: {
              action: 'api::service.service.find',
              subject: null,
              properties: {},
              conditions: [],
              role: publicRole.id,
            }
          });
        }

        const serviceFindOnePermission = await strapi.query('plugin::users-permissions.permission').findOne({
          where: { 
            action: 'api::service.service.findOne',
            role: publicRole.id 
          }
        });

        if (!serviceFindOnePermission) {
          await strapi.query('plugin::users-permissions.permission').create({
            data: {
              action: 'api::service.service.findOne',
              subject: null,
              properties: {},
              conditions: [],
              role: publicRole.id,
            }
          });
        }

        console.log('✅ Permissions configured successfully');
      }
    } catch (error) {
      console.error('❌ Error setting up permissions:', error);
    }
  },
};