'use strict';

const { createStrapi, compileStrapi } = require('@strapi/strapi');

async function testEventAPI() {
  const appContext = await compileStrapi();
  const strapi = await createStrapi(appContext).load();

  try {
    console.log('🔍 Testing Event API for banket-1...\n');

    // Найдем событие banket-1
    const events = await strapi.entityService.findMany('api::event-page.event-page', {
      filters: {
        Slug: {
          $eq: 'banket-1'
        }
      },
      populate: '*'
    });

    console.log('📊 Found events:', events.length);
    
    if (events.length > 0) {
      const event = events[0];
      console.log('\n📋 Event details:');
      console.log('- ID:', event.id);
      console.log('- Title:', event.title);
      console.log('- Slug:', event.Slug);
      console.log('- Description length:', event.Description?.length || 0);
      console.log('- Presentation:', event.Presentation);
      console.log('- presentation (lowercase):', event.presentation);
      
      console.log('\n🔑 All available fields:');
      Object.keys(event).forEach(key => {
        console.log(`  - ${key}: ${typeof event[key]}`);
      });
      
      // Проверим есть ли поле похожее на презентацию
      const presentationKeys = Object.keys(event).filter(key => 
        key.toLowerCase().includes('present')
      );
      
      if (presentationKeys.length > 0) {
        console.log('\n🎯 Presentation-related fields:');
        presentationKeys.forEach(key => {
          console.log(`  - ${key}: ${event[key]}`);
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await strapi.destroy();
  }
}

testEventAPI().catch(console.error);
