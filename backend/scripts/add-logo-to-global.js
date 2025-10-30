const axios = require('axios');

async function addLogoToGlobal() {
  try {
    const API_URL = 'http://localhost:1337/api';
    
    console.log('🔍 Получение текущих глобальных данных...');
    
    // Получаем текущие глобальные данные
    const globalResponse = await axios.get(`${API_URL}/global?populate=*`);
    const globalData = globalResponse.data.data;
    
    console.log('📋 Текущие глобальные данные:', {
      id: globalData.id,
      siteName: globalData.siteName,
      hasImgLogo: !!globalData.imgLogo,
      hasFeaturesImage: !!globalData.featuresImage
    });

    if (globalData.imgLogo) {
      console.log('✅ imgLogo уже установлен:', globalData.imgLogo.name);
      return;
    }

    // Если imgLogo нет, но есть featuresImage (Logo-white.png), используем его
    if (globalData.featuresImage && globalData.featuresImage.name.includes('Logo')) {
      console.log('🔄 Копируем featuresImage в imgLogo...');
      
      const updateData = {
        data: {
          imgLogo: globalData.featuresImage.id
        }
      };

      const updateResponse = await axios.put(`${API_URL}/global`, updateData);
      
      if (updateResponse.data) {
        console.log('✅ Логотип успешно добавлен в поле imgLogo!');
        
        // Проверяем результат
        const verifyResponse = await axios.get(`${API_URL}/global?populate=imgLogo`);
        const updatedData = verifyResponse.data.data;
        
        console.log('📋 Проверка результата:', {
          imgLogoId: updatedData.imgLogo?.id,
          imgLogoName: updatedData.imgLogo?.name,
          imgLogoUrl: updatedData.imgLogo?.url
        });
      }
    } else {
      console.log('❌ Не найдено подходящего изображения для логотипа');
      console.log('💡 Рекомендуется загрузить логотип через Strapi Admin панель');
      console.log('📍 Откройте http://localhost:1337/admin и перейдите в Content Manager > Global');
    }

  } catch (error) {
    console.error('❌ Ошибка при добавлении логотипа:', error.message);
    if (error.response) {
      console.error('📋 Детали ошибки:', error.response.data);
    }
  }
}

// Запускаем только если файл запущен напрямую
if (require.main === module) {
  addLogoToGlobal();
}

module.exports = addLogoToGlobal;
