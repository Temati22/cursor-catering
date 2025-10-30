const { createStrapi, compileStrapi } = require('@strapi/strapi');

async function publishAllEvents() {
  console.log('🚀 Starting Strapi to publish events...');
  
  // Initialize Strapi
  const appContext = await compileStrapi();
  const strapi = await createStrapi(appContext).load();
  
  try {
    console.log('📋 Publishing all event pages...');
    
    // Get all event pages
    const eventPages = await strapi.entityService.findMany('api::event-page.event-page', {
      populate: '*'
    });
    
    console.log(`📊 Found ${eventPages.length} event pages`);
    
    // Publish each event page
    for (const eventPage of eventPages) {
      console.log(`📝 Publishing: ${eventPage.title} (${eventPage.Slug})`);
      
      await strapi.entityService.update('api::event-page.event-page', eventPage.id, {
        data: {
          publishedAt: new Date()
        }
      });
      
      console.log(`✅ Published: ${eventPage.title}`);
    }
    
    console.log(`🎉 Successfully published ${eventPages.length} event pages!`);
    
  } catch (error) {
    console.error('❌ Error publishing events:', error);
  } finally {
    await strapi.destroy();
  }
}

// Run the script
publishAllEvents().catch(console.error);
