const axios = require('axios');

const API_BASE_URL = 'http://localhost:1337/api';

async function updateGlobalData() {
  try {
    console.log('Обновление глобальных данных...');
    
    // Данные для обновления
    const updateData = {
      data: {
        contactInfo: {
          phone1: '+7 (999) 123-45-67',
          phone2: '+7 (999) 765-43-21',
          email: 'info@hi-catering.ru',
          address: 'Москва, ул. Примерная, 123, офис 45'
        },
        socialLinks: {
          vk: 'https://vk.com/hi-catering',
          instagram: 'https://instagram.com/hi-catering',
          telegram: 'https://t.me/hi-catering',
          whatsapp: 'https://wa.me/79991234567'
        }
      }
    };

    // Сначала получим текущие данные
    console.log('Получение текущих данных...');
    const getResponse = await axios.get(`${API_BASE_URL}/global`);
    console.log('Текущие данные:', JSON.stringify(getResponse.data, null, 2));

    // Обновляем данные
    console.log('Обновление данных...');
    const updateResponse = await axios.put(`${API_BASE_URL}/global`, updateData);
    console.log('Данные обновлены:', JSON.stringify(updateResponse.data, null, 2));

    // Проверяем обновленные данные
    console.log('Проверка обновленных данных...');
    const checkResponse = await axios.get(`${API_BASE_URL}/global?populate=*`);
    console.log('Обновленные данные:', JSON.stringify(checkResponse.data, null, 2));

  } catch (error) {
    console.error('Ошибка при обновлении данных:', error.response?.data || error.message);
  }
}

updateGlobalData();
