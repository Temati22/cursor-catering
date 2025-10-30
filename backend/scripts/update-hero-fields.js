const strapi = require('@strapi/strapi');

async function updateHeroFields() {
  try {
    console.log('🔄 Обновление полей Hero секции...');
    
    // Получаем текущие глобальные данные
    const globalData = await strapi.entityService.findMany('api::global.global', {
      populate: '*'
    });

    if (!globalData || globalData.length === 0) {
      console.log('❌ Глобальные данные не найдены');
      return;
    }

    const global = globalData[0];

    // Обновляем поля Hero секции, если они не существуют
    const updateData = {};

    if (!global.heroTitle) {
      updateData.heroTitle = 'Hi-Catering Кейтеринг для вашего события';
    }

    if (!global.heroSubtitle) {
      updateData.heroSubtitle = 'Кейтеринг';
    }

    if (!global.heroDescription) {
      updateData.heroDescription = 'Профессиональный кейтеринг для любых мероприятий. Вкусная еда, качественный сервис, незабываемые впечатления.';
    }

    if (Object.keys(updateData).length > 0) {
      await strapi.entityService.update('api::global.global', global.id, {
        data: updateData
      });
      
      console.log('✅ Поля Hero секции успешно обновлены:');
      console.log('   - heroTitle:', updateData.heroTitle);
      console.log('   - heroSubtitle:', updateData.heroSubtitle);
      console.log('   - heroDescription:', updateData.heroDescription);
    } else {
      console.log('ℹ️  Поля Hero секции уже существуют');
    }

    console.log('🎉 Обновление завершено!');
  } catch (error) {
    console.error('❌ Ошибка при обновлении полей Hero секции:', error);
  }
}

// Запускаем скрипт
updateHeroFields()
  .then(() => {
    console.log('✅ Скрипт завершен');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Ошибка выполнения скрипта:', error);
    process.exit(1);
  });
