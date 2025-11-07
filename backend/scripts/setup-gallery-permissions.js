const { createStrapi, compileStrapi } = require('@strapi/strapi');

/**
 * Script to set up permissions for the Gallery content type
 * Run this with: npm run setup:gallery-permissions
 * or: node backend/scripts/setup-gallery-permissions.js
 */

async function setupGalleryPermissions() {
  console.log('🚀 Setting up Gallery permissions...\n');

  let strapi;
  
  try {
    // Initialize Strapi
    console.log('📦 Loading Strapi...');
    const appContext = await compileStrapi();
    strapi = await createStrapi(appContext).load();
    console.log('✅ Strapi loaded successfully\n');

    // Get Public role
    const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
      where: { type: 'public' }
    });

    if (!publicRole) {
      console.error('❌ Public role not found');
      return;
    }

    console.log(`📋 Found Public role (ID: ${publicRole.id})\n`);

    // Check if permission already exists
    const existingPermission = await strapi.query('plugin::users-permissions.permission').findOne({
      where: {
        action: 'api::gallery.gallery.find',
        role: publicRole.id
      }
    });

    if (existingPermission) {
      console.log('ℹ️  Gallery find permission already exists');
      console.log('✅ No action needed\n');
    } else {
      // Create find permission for Gallery (singleType only needs find)
      console.log('➕ Creating Gallery find permission...');
      await strapi.query('plugin::users-permissions.permission').create({
        data: {
          action: 'api::gallery.gallery.find',
          subject: null,
          properties: {},
          conditions: [],
          role: publicRole.id,
        }
      });
      console.log('✅ Gallery find permission created\n');
    }

    console.log('🎉 Gallery permissions configured successfully!\n');
    console.log('📝 Next steps:');
    console.log('1. Go to Strapi admin panel: http://localhost:1337/admin');
    console.log('2. Navigate to: Content Manager → Gallery');
    console.log('3. Add your gallery content (title, description, images)');
    console.log('4. Click Save and Publish');
    console.log('5. Visit: http://localhost:3000/galery\n');

  } catch (error) {
    console.error('❌ Error setting up Gallery permissions:');
    console.error(error.message);
    
    if (error.message.includes('ECONNREFUSED') || error.message.includes('connect')) {
      console.log('\n💡 Tip: Make sure Strapi is NOT running when executing this script.');
      console.log('   This script starts its own Strapi instance.\n');
    }
    
    process.exit(1);
  } finally {
    if (strapi) {
      console.log('🔄 Shutting down Strapi...');
      await strapi.destroy();
      console.log('✅ Done!\n');
    }
  }
}

setupGalleryPermissions();

