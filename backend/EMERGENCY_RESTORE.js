/**
 * EMERGENCY SCRIPT: Restore correct Global data
 * Use only when Strapi data gets corrupted!
 * Run with: node EMERGENCY_RESTORE.js
 */

const axios = require('axios');

const API_URL = 'http://localhost:1337/api';
const ADMIN_API_URL = 'http://localhost:1337/admin/api';

// CORRECT HI-CATERING DATA
const CORRECT_DATA = {
  siteName: "Hi Catering",
  siteDescription: "Профессиональный кейтеринг для любых мероприятий. Свадьбы, корпоративы, дни рождения и другие события.",
  heroTitle: "Кейтеринг высшего класса",
  heroSubtitle: "Забота о каждом вашем событии", 
  heroDescription: "Предлагаем полный спектр услуг кейтеринга для корпоративных мероприятий, свадеб, дней рождения и других событий. Высокое качество, индивидуальный подход и профессиональное обслуживание.",
  aboutText1: "Мы - команда профессионалов с многолетним опытом в сфере кейтеринга. Наша цель - сделать ваше мероприятие незабываемым.",
  aboutText2: "Используем только свежие и качественные продукты, работаем по индивидуальным рецептам и учитываем все ваши пожелания."
};

async function emergencyRestore() {
  console.log('🚨 EMERGENCY DATA RESTORATION STARTING...');
  
  try {
    // Check current state
    console.log('\n1️⃣ Checking current corruption...');
    const response = await axios.get(`${API_URL}/global?populate=*`);
    const current = response.data.data;
    
    console.log(`❌ CORRUPTED siteName: "${current.siteName}"`);
    console.log(`❌ CORRUPTED siteDescription: "${current.siteDescription}"`);
    
    if (current.siteName === 'Strapi Blog') {
      console.log('💀 CRITICAL: Data completely reverted to Strapi demo data!');
    }
    
    // Manual restoration instructions
    console.log('\n2️⃣ MANUAL RESTORATION REQUIRED:');
    console.log('🔧 Go to: http://localhost:1337/admin/content-manager/single-types/api::global.global');
    console.log('\n📝 SET THESE VALUES EXACTLY:');
    console.log(`siteName: "${CORRECT_DATA.siteName}"`);
    console.log(`siteDescription: "${CORRECT_DATA.siteDescription}"`);
    console.log(`heroTitle: "${CORRECT_DATA.heroTitle}"`);
    console.log(`heroSubtitle: "${CORRECT_DATA.heroSubtitle}"`);
    console.log(`heroDescription: "${CORRECT_DATA.heroDescription}"`);
    console.log(`aboutText1: "${CORRECT_DATA.aboutText1}"`);
    console.log(`aboutText2: "${CORRECT_DATA.aboutText2}"`);
    
    console.log('\n⚠️ CRITICAL INSTRUCTIONS:');
    console.log('1. 🚫 DO NOT change images until data is stable');
    console.log('2. ✅ Save ONLY after setting ALL text fields');
    console.log('3. 🔄 Refresh page after saving to verify');
    console.log('4. 📞 Call for help if data changes again');
    
    // Monitoring
    console.log('\n3️⃣ CONTINUOUS MONITORING...');
    setInterval(async () => {
      try {
        const check = await axios.get(`${API_URL}/global`);
        const data = check.data.data;
        
        if (data.siteName !== CORRECT_DATA.siteName) {
          console.log(`🚨 ALERT: siteName changed to "${data.siteName}"`);
        }
        
        if (data.siteDescription !== CORRECT_DATA.siteDescription) {
          console.log(`🚨 ALERT: siteDescription changed`);
        }
      } catch (err) {
        console.log('⚠️ Monitoring check failed:', err.message);
      }
    }, 10000); // Check every 10 seconds
    
  } catch (error) {
    console.error('❌ Emergency restore failed:', error.message);
  }
}

// Auto-run
if (require.main === module) {
  emergencyRestore();
  
  // Keep monitoring
  process.on('SIGINT', () => {
    console.log('\n✅ Emergency monitoring stopped');
    process.exit(0);
  });
}

module.exports = { emergencyRestore, CORRECT_DATA };
