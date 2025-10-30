const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');

async function uploadLogo() {
    try {
        console.log('Загружаем логотип в Strapi...');
        
        // Сначала загружаем файл в Strapi
        const logoPath = '/Users/artem/Documents/SITES/Hi-catering/apps/web/public/Logo.png';
        
        if (!fs.existsSync(logoPath)) {
            throw new Error('Файл Logo.png не найден');
        }
        
        const formData = new FormData();
        formData.append('files', fs.createReadStream(logoPath));
        
        // Загружаем файл
        const uploadResponse = await axios.post('http://localhost:1337/api/upload', formData, {
            headers: {
                ...formData.getHeaders(),
            },
        });
        
        console.log('✅ Файл загружен:', uploadResponse.data[0].id);
        
        // Теперь обновляем global с этим файлом
        const updateResponse = await axios.put('http://localhost:1337/api/global', {
            data: {
                headerLogo: uploadResponse.data[0].id
            }
        });
        
        console.log('✅ Global обновлен с логотипом');
        
        // Проверяем результат
        const checkResponse = await axios.get('http://localhost:1337/api/global?populate=*');
        console.log('✅ Проверка:', {
            hasHeaderLogo: checkResponse.data.data.hasOwnProperty('headerLogo'),
            headerLogo: checkResponse.data.data.headerLogo
        });
        
    } catch (error) {
        console.error('❌ Ошибка:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
    }
}

uploadLogo();
