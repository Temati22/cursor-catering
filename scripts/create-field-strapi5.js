const axios = require('axios');

async function createField() {
    try {
        console.log('Создаем поле headerLogo через Strapi 5 API...');
        
        // В Strapi 5 нужно использовать Content-Type Builder API
        // Сначала получаем информацию о Content Type
        const contentTypeResponse = await axios.get('http://localhost:1337/content-manager/content-types');
        console.log('Content Types:', contentTypeResponse.data);
        
        // Пытаемся создать поле через Content-Type Builder
        const fieldData = {
            name: 'headerLogo',
            type: 'media',
            multiple: false,
            required: false,
            allowedTypes: ['images', 'files']
        };
        
        console.log('Пытаемся создать поле:', fieldData);
        
        // В Strapi 5 поля создаются через Content-Type Builder
        // Но это требует прав администратора
        console.log('⚠️  В Strapi 5 поля должны создаваться через Content-Type Builder в админке');
        console.log('Перейдите в http://localhost:1337/admin');
        console.log('1. Content-Type Builder');
        console.log('2. Global (Single Type)');
        console.log('3. Add another field');
        console.log('4. Media');
        console.log('5. Настройте поле headerLogo');
        console.log('6. Save');
        
    } catch (error) {
        console.error('❌ Ошибка:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
    }
}

createField();
