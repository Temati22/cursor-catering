const { execSync } = require('child_process');

console.log('Принудительно обновляем схему Strapi...');

try {
    // Останавливаем Strapi
    console.log('Останавливаем Strapi...');
    execSync('docker stop modern-seo-backend', { stdio: 'inherit' });
    
    // Удаляем кэш
    console.log('Удаляем кэш...');
    execSync('docker exec modern-seo-backend rm -rf /app/.cache', { stdio: 'inherit' });
    
    // Запускаем Strapi
    console.log('Запускаем Strapi...');
    execSync('docker start modern-seo-backend', { stdio: 'inherit' });
    
    console.log('✅ Strapi перезапущен');
    
} catch (error) {
    console.error('❌ Ошибка:', error.message);
}
