/**
 * event-page controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::event-page.event-page', ({ strapi }) => ({
  async find(ctx) {
    // Call the default find method
    const { data, meta } = await super.find(ctx);
    
    // Populate menus for each event page
    if (data && Array.isArray(data)) {
      for (const eventPage of data) {
        if (eventPage.menus && Array.isArray(eventPage.menus)) {
          for (const menuComponent of eventPage.menus) {
            if (menuComponent.__component === 'shared.menus-in-events' && menuComponent.id) {
              // Load the component data from the database
              const componentData = await strapi.db.query('shared.menus-in-events').findOne({
                where: { id: menuComponent.id },
                populate: {
                  menus: {
                    populate: {
                      image: true
                    }
                  }
                }
              });
              
              if (componentData && componentData.menus) {
                menuComponent.menus = componentData.menus;
              }
            }
          }
        }
      }
    }
    
    return { data, meta };
  },
  
  async findOne(ctx) {
    // Call the default findOne method
    const { data, meta } = await super.findOne(ctx);
    
    // Populate menus for the event page
    if (data && data.menus && Array.isArray(data.menus)) {
      for (const menuComponent of data.menus) {
        if (menuComponent.__component === 'shared.menus-in-events' && menuComponent.id) {
          // Load the component data from the database
          const componentData = await strapi.db.query('shared.menus-in-events').findOne({
            where: { id: menuComponent.id },
            populate: {
              menus: {
                populate: {
                  image: true
                }
              }
            }
          });
          
          if (componentData && componentData.menus) {
            menuComponent.menus = componentData.menus;
          }
        }
      }
    }
    
    return { data, meta };
  }
}));
