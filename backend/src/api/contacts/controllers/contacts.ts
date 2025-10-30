/**
 * contacts controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::contacts.contacts', ({ strapi }) => ({
  async find(ctx) {
    // Bypass authentication for public access
    try {
      // Use direct database query to get the contacts data
      const rawData = await strapi.db.connection('contacts').select('*').first();
      if (!rawData) {
        // Return fallback data if no contacts data exists
        return { 
          data: {
            id: 1,
            documentId: 'fallback',
            title: 'Контакты',
            workingHours: 'Пн-Пт: 9:00-18:00',
            mapEmbed: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            publishedAt: new Date().toISOString(),
            locale: null,
          }
        };
      }

      // Convert snake_case to camelCase
      const data = {
        id: rawData.id,
        documentId: rawData.document_id,
        title: rawData.title,
        workingHours: rawData.working_hours,
        mapEmbed: rawData.map_embed,
        createdAt: new Date(rawData.created_at).toISOString(),
        updatedAt: new Date(rawData.updated_at).toISOString(),
        publishedAt: new Date(rawData.published_at).toISOString(),
        locale: rawData.locale,
      };

      return { data };
    } catch (error) {
      console.error('Error in contacts controller:', error);
      // Return fallback data on error
      return { 
        data: {
          id: 1,
          documentId: 'fallback',
          title: 'Контакты',
          workingHours: 'Пн-Пт: 9:00-18:00',
          mapEmbed: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          publishedAt: new Date().toISOString(),
          locale: null,
        }
      };
    }
  },
}));
