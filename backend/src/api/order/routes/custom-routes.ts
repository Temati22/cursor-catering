export default {
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
    {
      method: 'GET',
      path: '/orders/dashboard',
      handler: 'api::order.order.dashboard',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};
