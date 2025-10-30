/**
 * order controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::order.order', ({ strapi }) => ({
  async create(ctx) {
    try {
      // Generate unique order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      // Calculate total amount from order items
      const { orderItems } = ctx.request.body.data;
      let totalAmount = 0;
      
      if (orderItems && orderItems.length > 0) {
        for (const item of orderItems) {
          if (item.menu && item.quantity && item.unitPrice) {
            item.totalPrice = item.quantity * item.unitPrice;
            totalAmount += item.totalPrice;
          }
        }
      }
      
      // Add order number and total amount to the data
      const orderData = {
        ...ctx.request.body.data,
        orderNumber,
        totalAmount
      };
      
      // Create the order
      const order = await strapi.entityService.create('api::order.order', {
        data: orderData,
        populate: {
          orderItems: {
            populate: {
              menu: {
                populate: ['image', 'dishes']
              }
            }
          }
        }
      });
      
      return { data: order };
    } catch (error) {
      console.error('Error creating order:', error);
      ctx.throw(500, 'Failed to create order');
    }
  },

  async find(ctx) {
    try {
      const { data, meta } = await super.find(ctx);
      
      // Populate order items with menu details
      const populatedData = await Promise.all(
        data.map(async (order) => {
          if (order.orderItems) {
            const populatedItems = await Promise.all(
              order.orderItems.map(async (item) => {
                if (item.menu) {
                  const menu = await strapi.entityService.findOne('api::menu.menu', item.menu, {
                    populate: ['image', 'dishes']
                  });
                  return { ...item, menu };
                }
                return item;
              })
            );
            return { ...order, orderItems: populatedItems };
          }
          return order;
        })
      );
      
      return { data: populatedData, meta };
    } catch (error) {
      console.error('Error fetching orders:', error);
      ctx.throw(500, 'Failed to fetch orders');
    }
  },

  async findOne(ctx) {
    try {
      const { data } = await super.findOne(ctx);
      
      if (data && data.orderItems) {
        const populatedItems = await Promise.all(
          data.orderItems.map(async (item) => {
            if (item.menu) {
              const menu = await strapi.entityService.findOne('api::menu.menu', item.menu, {
                populate: ['image', 'dishes']
              });
              return { ...item, menu };
            }
            return item;
          })
        );
        return { data: { ...data, orderItems: populatedItems } };
      }
      
      return { data };
    } catch (error) {
      console.error('Error fetching order:', error);
      ctx.throw(500, 'Failed to fetch order');
    }
  },

  async updateStatus(ctx) {
    try {
      const { id } = ctx.params;
      const { status } = ctx.request.body;
      
      const order = await strapi.entityService.update('api::order.order', id, {
        data: { status },
        populate: {
          orderItems: {
            populate: {
              menu: {
                populate: ['image', 'dishes']
              }
            }
          }
        }
      });
      
      return { data: order };
    } catch (error) {
      console.error('Error updating order status:', error);
      ctx.throw(500, 'Failed to update order status');
    }
  },

  // Dashboard endpoint for admin panel
  async dashboard(ctx) {
    try {
      const orders = await strapi.entityService.findMany('api::order.order', {
        populate: {
          orderItems: {
            populate: {
              menu: true
            }
          }
        },
        sort: { createdAt: 'desc' },
        limit: 50
      });

      // Calculate statistics
      const stats = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        confirmed: orders.filter(o => o.status === 'confirmed').length,
        preparing: orders.filter(o => o.status === 'preparing').length,
        ready: orders.filter(o => o.status === 'ready').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length,
        totalRevenue: orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
      };

      return { data: { orders, stats } };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      ctx.throw(500, 'Failed to fetch dashboard data');
    }
  }
}));