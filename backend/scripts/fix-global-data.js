/**
 * Script to fix corrupted Global data (remove strange numbers and reset to correct values)
 * Run with: node scripts/fix-global-data.js
 */

const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:1337/api';
const ADMIN_API_URL = process.env.ADMIN_API_URL || 'http://localhost:1337/admin/api';

// Correct data that should be in Global
const CORRECT_GLOBAL_DATA = {
  siteName: "Hi Catering",
  siteDescription: "Профессиональный кейтеринг для любых мероприятий. Свадьбы, корпоративы, дни рождения и другие события.",
  heroTitle: "Кейтеринг высшего класса", 
  heroSubtitle: "Забота о каждом вашем событии",
  heroDescription: "Предлагаем полный спектр услуг кейтеринга для корпоративных мероприятий, свадеб, дней рождения и других событий. Высокое качество, индивидуальный подход и профессиональное обслуживание."
};

async function fixGlobalData() {
  try {
    console.log('🔧 Fixing Global data...\n');
    
    // Step 1: Check current data
    console.log('1️⃣ Checking current Global data...');
    const response = await axios.get(`${API_URL}/global?populate=*`);
    const currentData = response.data.data;
    
    console.log('Current siteName:', currentData.siteName);
    console.log('Current siteDescription:', currentData.siteDescription);
    console.log('Current heroTitle:', currentData.heroTitle);
    console.log('Current heroSubtitle:', currentData.heroSubtitle);
    
    // Step 2: Detect issues
    console.log('\n2️⃣ Detecting issues...');
    const issues = [];
    
    if (currentData.siteName !== CORRECT_GLOBAL_DATA.siteName) {
      issues.push(`siteName: "${currentData.siteName}" should be "${CORRECT_GLOBAL_DATA.siteName}"`);
    }
    
    if (currentData.siteDescription !== CORRECT_GLOBAL_DATA.siteDescription) {
      issues.push(`siteDescription has been modified`);
    }
    
    if (currentData.heroTitle !== CORRECT_GLOBAL_DATA.heroTitle) {
      issues.push(`heroTitle: "${currentData.heroTitle}" should be "${CORRECT_GLOBAL_DATA.heroTitle}"`);
    }
    
    if (currentData.heroSubtitle !== CORRECT_GLOBAL_DATA.heroSubtitle) {
      issues.push(`heroSubtitle: "${currentData.heroSubtitle}" should be "${CORRECT_GLOBAL_DATA.heroSubtitle}"`);
    }
    
    if (issues.length === 0) {
      console.log('✅ No issues found. Data is correct.');
      return;
    }
    
    console.log('❌ Found issues:');
    issues.forEach(issue => console.log(`   - ${issue}`));
    
    // Step 3: Prepare update data (keep existing images and other data)
    console.log('\n3️⃣ Preparing corrected data...');
    const updateData = {
      siteName: CORRECT_GLOBAL_DATA.siteName,
      siteDescription: CORRECT_GLOBAL_DATA.siteDescription,
      heroTitle: CORRECT_GLOBAL_DATA.heroTitle,
      heroSubtitle: CORRECT_GLOBAL_DATA.heroSubtitle,
      heroDescription: CORRECT_GLOBAL_DATA.heroDescription,
      // Keep existing data for other fields
      aboutText1: currentData.aboutText1,
      aboutText2: currentData.aboutText2,
      // Keep existing relations and images
      favicon: currentData.favicon,
      heroImage: currentData.heroImage,
      featuresImage: currentData.featuresImage,
      ctaImage: currentData.ctaImage,
      aboutImage: currentData.aboutImage,
      defaultSeo: currentData.defaultSeo,
      socialLinks: currentData.socialLinks,
      contactInfo: currentData.contactInfo
    };
    
    console.log('✅ Prepared update data');
    
    // Step 4: Show what will be updated
    console.log('\n4️⃣ Will update:');
    console.log(`siteName: "${currentData.siteName}" → "${updateData.siteName}"`);
    console.log(`siteDescription: → "${updateData.siteDescription}"`);
    console.log(`heroTitle: "${currentData.heroTitle}" → "${updateData.heroTitle}"`);
    console.log(`heroSubtitle: "${currentData.heroSubtitle}" → "${updateData.heroSubtitle}"`);
    
    // Note: In a real scenario, you would make a PUT request to update the data
    // For now, just showing what would be updated
    console.log('\n⚠️ To apply these fixes:');
    console.log('1. Go to http://localhost:1337/admin/content-manager/single-types/api::global.global');
    console.log('2. Manually set the correct values:');
    console.log(`   siteName: "${CORRECT_GLOBAL_DATA.siteName}"`);
    console.log(`   siteDescription: "${CORRECT_GLOBAL_DATA.siteDescription}"`);
    console.log(`   heroTitle: "${CORRECT_GLOBAL_DATA.heroTitle}"`);
    console.log(`   heroSubtitle: "${CORRECT_GLOBAL_DATA.heroSubtitle}"`);
    console.log('3. Save the record');
    console.log('4. Clear browser cache and reload admin panel');
    
  } catch (error) {
    console.error('❌ Error fixing Global data:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Data: ${JSON.stringify(error.response.data, null, 2)}`);
    } else if (error.request) {
      console.error('No response received. Is Strapi running?');
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Run the script
if (require.main === module) {
  fixGlobalData();
}

module.exports = { fixGlobalData, CORRECT_GLOBAL_DATA };
