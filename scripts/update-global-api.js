const axios = require('axios');

async function updateGlobal() {
    try {
        console.log('Обновляем Global через API...');
        
        // Сначала получаем текущие данные
        const getResponse = await axios.get('http://localhost:1337/api/global');
        console.log('Текущие данные:', Object.keys(getResponse.data.data));
        
        // Пытаемся обновить с полем headerLogo
        const updateResponse = await axios.put('http://localhost:1337/api/global', {
            data: {
                ...getResponse.data.data,
                headerLogo: 14
            }
        });
        
        console.log('✅ Global обновлен');
        
        // Проверяем результат
        const checkResponse = await axios.get('http://localhost:1337/api/global?populate=*');
        console.log('✅ Проверка:', {
            hasHeaderLogo: checkResponse.data.data.hasOwnProperty('headerLogo'),
            headerLogo: checkResponse.data.data.headerLogo,
            allKeys: Object.keys(checkResponse.data.data)
        });
        
    } catch (error) {
        console.error('❌ Ошибка:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
    }
}

updateGlobal();
