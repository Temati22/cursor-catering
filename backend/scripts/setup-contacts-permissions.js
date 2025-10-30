'use strict';

/**
 * Script to set up public permissions for contacts API
 */

module.exports = async ({ strapi }) => {
  try {
    console.log('Setting up contacts permissions...');

    // Get the public role
    const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({
      where: { type: 'public' },
    });

    if (!publicRole) {
      console.log('Public role not found');
      return;
    }

    // Set permissions for contacts API
    const contactsPermissions = await strapi.db.query('plugin::users-permissions.permission').findMany({
      where: {
        role: publicRole.id,
        action: 'api::contacts.contacts.find',
      },
    });

    if (contactsPermissions.length === 0) {
      await strapi.db.query('plugin::users-permissions.permission').create({
        data: {
          action: 'api::contacts.contacts.find',
          subject: null,
          properties: {},
          conditions: [],
          role: publicRole.id,
        },
      });
      console.log('✅ Contacts find permission created for public role');
    } else {
      console.log('✅ Contacts find permission already exists for public role');
    }

    console.log('Contacts permissions setup completed');
  } catch (error) {
    console.error('Error setting up contacts permissions:', error);
  }
};