const fs = require('fs');
const path = require('path');

console.log('Обновляем схему Strapi...');

// Читаем текущую схему
const schemaPath = '/Users/artem/Documents/SITES/Hi-catering/backend/src/api/global/content-types/global/schema.json';
const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

console.log('Текущая схема:', Object.keys(schema.attributes));

// Проверяем, есть ли поле headerLogo
if (schema.attributes.headerLogo) {
    console.log('✅ Поле headerLogo уже есть в схеме');
} else {
    console.log('❌ Поле headerLogo отсутствует в схеме');
}

// Проверяем, есть ли поле в базе данных
const { execSync } = require('child_process');
try {
    const checkCommand = `
        docker exec -i modern-seo-postgres psql -U strapi -d modern_seo_site -c "
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'globals' AND column_name = 'header_logo';
        "
    `;
    
    const result = execSync(checkCommand, { encoding: 'utf8' });
    console.log('Поле в базе данных:', result);
    
    // Проверяем значение
    const valueCommand = `
        docker exec -i modern-seo-postgres psql -U strapi -d modern_seo_site -c "
        SELECT id, header_logo FROM globals WHERE id = 1;
        "
    `;
    
    const valueResult = execSync(valueCommand, { encoding: 'utf8' });
    console.log('Значение в базе данных:', valueResult);
    
} catch (error) {
    console.error('Ошибка при проверке базы данных:', error.message);
}
