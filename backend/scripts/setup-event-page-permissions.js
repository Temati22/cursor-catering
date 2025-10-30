'use strict';

/**
 * Script to set up public permissions for event-page API
 */

module.exports = async ({ strapi }) => {
  try {
    console.log('Setting up event-page permissions...');

    // Get the public role
    const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({
      where: { type: 'public' },
    });

    if (!publicRole) {
      console.log('Public role not found');
      return;
    }

    // Set permissions for event-page.find
    const eventPageFindPermissions = await strapi.db.query('plugin::users-permissions.permission').findMany({
      where: {
        role: publicRole.id,
        action: 'api::event-page.event-page.find',
      },
    });

    if (eventPageFindPermissions.length === 0) {
      await strapi.db.query('plugin::users-permissions.permission').create({
        data: {
          action: 'api::event-page.event-page.find',
          subject: null,
          properties: {},
          conditions: [],
          role: publicRole.id,
        },
      });
      console.log('✅ Event-page find permission created for public role');
    } else {
      console.log('✅ Event-page find permission already exists for public role');
    }

    // Set permissions for event-page.findOne
    const eventPageFindOnePermissions = await strapi.db.query('plugin::users-permissions.permission').findMany({
      where: {
        role: publicRole.id,
        action: 'api::event-page.event-page.findOne',
      },
    });

    if (eventPageFindOnePermissions.length === 0) {
      await strapi.db.query('plugin::users-permissions.permission').create({
        data: {
          action: 'api::event-page.event-page.findOne',
          subject: null,
          properties: {},
          conditions: [],
          role: publicRole.id,
        },
      });
      console.log('✅ Event-page findOne permission created for public role');
    } else {
      console.log('✅ Event-page findOne permission already exists for public role');
    }

    console.log('Event-page permissions setup completed');
  } catch (error) {
    console.error('Error setting up event-page permissions:', error);
  }
};
