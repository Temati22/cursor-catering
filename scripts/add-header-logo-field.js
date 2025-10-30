const { execSync } = require('child_process');

console.log('Добавляем поле headerLogo в базу данных...');

try {
    // Подключаемся к базе данных и добавляем колонку
    const command = `
        docker exec -i modern-seo-postgres psql -U strapi -d modern_seo_site -c "
        ALTER TABLE globals ADD COLUMN IF NOT EXISTS header_logo INTEGER;
        ALTER TABLE globals ADD CONSTRAINT fk_globals_header_logo 
        FOREIGN KEY (header_logo) REFERENCES files(id) ON DELETE SET NULL;
        "
    `;
    
    execSync(command, { stdio: 'inherit' });
    console.log('✅ Поле headerLogo добавлено в базу данных');
    
    // Проверяем, что поле добавлено
    const checkCommand = `
        docker exec -i modern-seo-postgres psql -U strapi -d modern_seo_site -c "
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'globals' AND column_name = 'header_logo';
        "
    `;
    
    execSync(checkCommand, { stdio: 'inherit' });
    
} catch (error) {
    console.error('❌ Ошибка при добавлении поля:', error.message);
    process.exit(1);
}
