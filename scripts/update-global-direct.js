const { execSync } = require('child_process');

console.log('Обновляем Global напрямую через базу данных...');

try {
    // Обновляем поле header_logo в таблице globals
    console.log('Обновляем поле header_logo...');
    const updateCommand = `
        docker exec -i modern-seo-postgres psql -U strapi -d modern_seo_site -c "
        UPDATE globals SET header_logo = 14 WHERE id = 1;
        SELECT id, header_logo FROM globals WHERE id = 1;
        "
    `;
    
    const result = execSync(updateCommand, { encoding: 'utf8' });
    console.log('Результат обновления:', result);
    
    // Проверяем, что поле обновилось
    console.log('Проверяем обновление...');
    const checkCommand = `
        docker exec -i modern-seo-postgres psql -U strapi -d modern_seo_site -c "
        SELECT id, header_logo FROM globals WHERE id = 1;
        "
    `;
    
    const checkResult = execSync(checkCommand, { encoding: 'utf8' });
    console.log('Проверка:', checkResult);
    
    console.log('✅ Поле header_logo обновлено в базе данных');
    
} catch (error) {
    console.error('❌ Ошибка:', error.message);
}
