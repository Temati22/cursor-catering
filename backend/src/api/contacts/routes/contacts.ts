/**
 * contacts router
 */

import { factories } from '@strapi/strapi';

export default {
  routes: [
    {
      method: 'GET',
      path: '/contacts',
      handler: 'contacts.find',
      config: {
        auth: false, // Disable authentication for public access
      },
    },
  ],
};
