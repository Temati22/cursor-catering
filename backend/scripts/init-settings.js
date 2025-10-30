/**
 * Script to initialize global settings with contact info and social links
 * Run with: node scripts/init-settings.js
 */

const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:1337/api';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || '';

// Default settings data
const defaultSettings = {
  siteName: 'Hi-Catering',
  siteDescription: 'Профессиональный кейтеринг для ваших мероприятий. Качественная еда, отличный сервис и незабываемые впечатления.',
  socialLinks: {
    vk: 'https://vk.com/hi-catering',
    instagram: 'https://instagram.com/hi-catering',
    telegram: 'https://t.me/hi-catering',
    whatsapp: 'https://wa.me/79999999999'
  },
  contactInfo: {
    phone1: '+7 999 999 99 99',
    phone2: '+7 888 888 88 88',
    email: 'info@hi-catering.ru',
    address: 'Москва, ул. Примерная, 123'
  }
};

async function initSettings() {
  try {
    console.log('🚀 Initializing global settings...');
    
    // Check if global settings already exist
    const response = await axios.get(`${API_URL}/global`);
    
    if (response.data && response.data.data) {
      console.log('✅ Global settings already exist');
      console.log('Current settings:', JSON.stringify(response.data.data, null, 2));
      return;
    }
    
    // Create new global settings
    const createResponse = await axios.post(`${API_URL}/global`, {
      data: defaultSettings
    });
    
    console.log('✅ Global settings created successfully');
    console.log('Settings:', JSON.stringify(createResponse.data.data, null, 2));
    
  } catch (error) {
    if (error.response) {
      console.error('❌ Error response:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('❌ No response received:', error.request);
    } else {
      console.error('❌ Error:', error.message);
    }
    
    console.log('\n💡 Make sure:');
    console.log('1. Strapi server is running on http://localhost:1337');
    console.log('2. API is accessible');
    console.log('3. Global content type exists in Strapi');
  }
}

// Run the script
if (require.main === module) {
  initSettings();
}

module.exports = { initSettings, defaultSettings };
