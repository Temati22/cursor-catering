const { execSync } = require('child_process');

console.log('Принудительно обновляем схему через базу данных...');

try {
    // Проверяем, есть ли поле в базе данных
    console.log('Проверяем поле в базе данных...');
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
    
    // Проверяем, есть ли поле в схеме Strapi
    console.log('Проверяем схему Strapi...');
    const schemaCommand = `
        docker exec -i modern-seo-postgres psql -U strapi -d modern_seo_site -c "
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'globals' 
        ORDER BY column_name;
        "
    `;
    
    const schemaResult = execSync(schemaCommand, { encoding: 'utf8' });
    console.log('Все поля в таблице globals:', schemaResult);
    
} catch (error) {
    console.error('❌ Ошибка:', error.message);
}
