/**
 * order router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::order.order', {
  config: {
    find: {
      auth: false,
      policies: [],
      middlewares: [],
    },
    findOne: {
      auth: false,
      policies: [],
      middlewares: [],
    },
    create: {
      auth: false,
      policies: [],
      middlewares: [],
    },
    update: {
      auth: false,
      policies: [],
      middlewares: [],
    },
    delete: {
      auth: false,
      policies: [],
      middlewares: [],
    },
  },
});

// Custom route for updating order status
export const customRoutes = {
  routes: [
    {
      method: 'PUT',
      path: '/orders/:id/status',
      handler: 'api::order.order.updateStatus',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};