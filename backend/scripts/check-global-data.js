/**
 * Script to check and update global data
 * Run with: node scripts/check-global-data.js
 */

const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:1337/api';

async function checkGlobalData() {
  try {
    console.log('🔍 Checking global data...');
    
    // Get current global data
    const response = await axios.get(`${API_URL}/global?populate=*`);
    console.log('Current global data:');
    console.log(JSON.stringify(response.data, null, 2));
    
    // Check if contactInfo and socialLinks exist
    const data = response.data.data;
    if (!data.contactInfo) {
      console.log('❌ contactInfo is missing');
    } else {
      console.log('✅ contactInfo exists:', data.contactInfo);
    }
    
    if (!data.socialLinks) {
      console.log('❌ socialLinks is missing');
    } else {
      console.log('✅ socialLinks exists:', data.socialLinks);
    }
    
  } catch (error) {
    if (error.response) {
      console.error('❌ Error response:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('❌ No response received:', error.request);
    } else {
      console.error('❌ Error:', error.message);
    }
  }
}

// Run the script
if (require.main === module) {
  checkGlobalData();
}

module.exports = { checkGlobalData };
