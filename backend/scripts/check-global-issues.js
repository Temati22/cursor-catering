/**
 * Script to check Global data inconsistencies via Strapi API (PostgreSQL)
 * Run with: node scripts/check-global-issues.js
 */

const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:1337/api';
const ADMIN_URL = process.env.ADMIN_URL || 'http://localhost:1337/admin';

async function checkGlobalIssues() {
  console.log('🔍 Analyzing Global data inconsistencies...\n');

  try {
    // Check API response
    console.log('1️⃣ Checking API response...');
    const apiResponse = await axios.get(`${API_URL}/global?populate=*`);
    const apiData = apiResponse.data.data;
    
    console.log(`API Response - ID: ${apiData.id}, DocumentID: ${apiData.documentId}`);
    console.log(`Site Name: ${apiData.siteName}`);
    console.log(`Created: ${apiData.createdAt}`);
    console.log(`Updated: ${apiData.updatedAt}\n`);

    // Check if there are potential caching issues
    console.log('2️⃣ Checking for potential issues...');
    
    // Check multiple calls consistency
    console.log('Making multiple API calls to check consistency...');
    for (let i = 1; i <= 3; i++) {
      const response = await axios.get(`${API_URL}/global?populate=*&_t=${Date.now()}`);
      const data = response.data.data;
      console.log(`Call ${i}: ID=${data.id}, DocumentID=${data.documentId}, Name="${data.siteName}"`);
      
      // Check if data differs
      if (data.id !== apiData.id || data.documentId !== apiData.documentId) {
        console.log('⚠️ WARNING: Inconsistent data detected!');
      }
    }

    // Check specific fields that might cause issues
    console.log('\n3️⃣ Analyzing potential problematic fields...');
    
    const problematicFields = [];
    
    // Check for empty or undefined critical fields
    if (!apiData.siteName || apiData.siteName.trim() === '') {
      problematicFields.push('siteName is empty');
    }
    
    if (!apiData.siteDescription || apiData.siteDescription.trim() === '') {
      problematicFields.push('siteDescription is empty');
    }
    
    // Check for missing components
    if (!apiData.contactInfo) {
      problematicFields.push('contactInfo component is missing');
    }
    
    if (!apiData.socialLinks) {
      problematicFields.push('socialLinks component is missing');
    }
    
    // Check for invalid image references
    if (apiData.heroImage && !apiData.heroImage.url) {
      problematicFields.push('heroImage exists but has no URL');
    }
    
    if (apiData.favicon && !apiData.favicon.url) {
      problematicFields.push('favicon exists but has no URL');
    }

    if (problematicFields.length > 0) {
      console.log('⚠️ Found potential issues:');
      problematicFields.forEach(issue => console.log(`   - ${issue}`));
    } else {
      console.log('✅ No obvious field issues found');
    }

    // Check for version/history issues
    console.log('\n4️⃣ Recommendations...');
    
    console.log('If you see strange data in admin panel:');
    console.log('1. Clear browser cache and cookies for localhost:1337');
    console.log('2. Restart Strapi backend server');
    console.log('3. Check if you have multiple browser tabs with admin open');
    console.log('4. Try opening admin in incognito/private mode');
    
    console.log('\nTo fix any data issues:');
    console.log('1. Go to http://localhost:1337/admin/content-manager/single-types/api::global.global');
    console.log('2. Review all fields carefully');
    console.log('3. Save the record to ensure consistency');
    console.log('4. Check if the frontend displays correct data');

    return {
      success: true,
      data: apiData,
      issues: problematicFields
    };

  } catch (error) {
    console.error('❌ Error checking Global data:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Data: ${JSON.stringify(error.response.data, null, 2)}`);
    } else if (error.request) {
      console.error('No response received. Is Strapi running on localhost:1337?');
    } else {
      console.error('Error:', error.message);
    }
    
    return {
      success: false,
      error: error.message
    };
  }
}

// Run the script
if (require.main === module) {
  checkGlobalIssues().then(result => {
    if (result.success) {
      console.log('\n✅ Analysis completed successfully');
      if (result.issues.length > 0) {
        process.exit(1); // Exit with error if issues found
      }
    } else {
      console.log('\n❌ Analysis failed');
      process.exit(1);
    }
  });
}

module.exports = { checkGlobalIssues };
