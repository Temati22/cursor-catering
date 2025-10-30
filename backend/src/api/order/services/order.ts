/**
 * order service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::order.order', ({ strapi }) => ({
  async generateOrderNumber() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9).toUpperCase();
    return `ORD-${timestamp}-${random}`;
  },

  async calculateOrderTotal(orderItems) {
    let total = 0;
    
    if (orderItems && orderItems.length > 0) {
      for (const item of orderItems) {
        if (item.quantity && item.unitPrice) {
          total += item.quantity * item.unitPrice;
        }
      }
    }
    
    return total;
  },

  async validateOrderItems(orderItems) {
    if (!orderItems || orderItems.length === 0) {
      throw new Error('Order must contain at least one item');
    }

    for (const item of orderItems) {
      if (!item.menu || !item.quantity || !item.unitPrice) {
        throw new Error('Each order item must have menu, quantity, and unit price');
      }

      if (item.quantity < 1) {
        throw new Error('Quantity must be at least 1');
      }

      // Verify menu exists and is active
      const menu = await strapi.entityService.findOne('api::menu.menu', item.menu);
      if (!menu || !menu.isActive) {
        throw new Error(`Menu with ID ${item.menu} not found or inactive`);
      }
    }

    return true;
  }
}));
