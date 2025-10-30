const { createStrapi, compileStrapi } = require('@strapi/strapi');

async function fixEventPagePermissions() {
  console.log('🚀 Fixing event-page API permissions...');
  
  const appContext = await compileStrapi();
  const strapi = await createStrapi(appContext).load();

  try {
    // Find the public role
    const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
      where: { type: 'public' }
    });

    if (!publicRole) {
      console.error('❌ Public role not found');
      process.exit(1);
    }

    console.log(`📋 Found public role with ID: ${publicRole.id}`);

    // Check existing permissions
    const existingPermissions = await strapi.query('plugin::users-permissions.permission').findMany({
      where: {
        role: publicRole.id,
        action: {
          $startsWith: 'api::event-page'
        }
      }
    });

    console.log(`📊 Found ${existingPermissions.length} existing event-page permissions`);

    // Define required permissions
    const requiredPermissions = [
      'api::event-page.event-page.find',
      'api::event-page.event-page.findOne'
    ];

    for (const permission of requiredPermissions) {
      const exists = existingPermissions.find(p => p.action === permission);
      
      if (!exists) {
        console.log(`➕ Creating permission: ${permission}`);
        await strapi.query('plugin::users-permissions.permission').create({
          data: {
            action: permission,
            subject: null,
            properties: {},
            conditions: [],
            role: publicRole.id,
          }
        });
        console.log(`✅ Created permission: ${permission}`);
      } else {
        console.log(`✅ Permission already exists: ${permission}`);
      }
    }

    // Verify permissions were created
    const finalPermissions = await strapi.query('plugin::users-permissions.permission').findMany({
      where: {
        role: publicRole.id,
        action: {
          $startsWith: 'api::event-page'
        }
      }
    });

    console.log(`🎉 Final permissions count: ${finalPermissions.length}`);
    console.log('📝 Event-page permissions:');
    finalPermissions.forEach(p => {
      console.log(`   - ${p.action}`);
    });

    // Test the API endpoint
    console.log('\n🧪 Testing event-pages API...');
    try {
      const eventPages = await strapi.query('api::event-page.event-page').findMany();
      console.log(`✅ API test successful! Found ${eventPages.length} event pages`);
      
      if (eventPages.length === 0) {
        console.log('ℹ️  No event pages found. You may need to create some content in Strapi admin.');
      }
    } catch (error) {
      console.error('❌ API test failed:', error.message);
    }

    console.log('\n✅ Event-page permissions setup completed successfully!');

  } catch (error) {
    console.error('❌ Error setting up event-page permissions:', error);
    process.exit(1);
  } finally {
    await strapi.destroy();
  }
}

// Self-executing function
fixEventPagePermissions()
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
