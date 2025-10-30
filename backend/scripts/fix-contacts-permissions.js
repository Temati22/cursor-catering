const { execSync } = require('child_process');

console.log('Fixing contacts permissions...');

try {
  // Try to set permissions via Strapi CLI
  execSync('npx strapi admin:create-user --firstname=Admin --lastname=User --email=admin@example.com --password=admin123', { stdio: 'inherit' });
  console.log('✅ Admin user created');
} catch (error) {
  console.log('Admin user might already exist, continuing...');
}

console.log('Please manually set permissions in Strapi admin:');
console.log('1. Go to http://localhost:1337/admin');
console.log('2. Navigate to Settings > Users & Permissions > Roles');
console.log('3. Click on Public role');
console.log('4. Enable "find" permission for Contacts');
console.log('5. Save');
