/**
 *  global controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::global.global', ({ strapi }) => ({
  async find(ctx) {
    // Bypass authentication for public access
    try {
      // For singleType, use findMany and get the first result
      const entities = await strapi.documents('api::global.global').findMany({
        populate: ['contactInfo', 'socialLinks', 'favicon', 'heroImage', 'featuresImage', 'ctaImage', 'aboutImage', 'defaultSeo'],
      });

      if (!entities || entities.length === 0) {
        return { data: null };
      }

      return { data: entities[0] };
    } catch (error) {
      console.error('Error in global controller:', error);
      ctx.throw(500, error);
    }
  },
}));
