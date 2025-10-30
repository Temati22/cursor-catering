'use strict';

const fs = require('fs-extra');
const path = require('path');
const mime = require('mime-types');

async function checkFileExistsBeforeUpload(files) {
  const allFiles = [];
  
  for (const file of files) {
    const filePath = path.join(__dirname, '../data/uploads', file);
    const fileExists = await fs.pathExists(filePath);
    
    if (fileExists) {
      const fileBuffer = await fs.readFile(filePath);
      const fileStat = await fs.stat(filePath);
      const mimeType = mime.lookup(filePath);
      
      const uploadedFile = await strapi.plugins.upload.services.upload.upload({
        data: {},
        files: {
          name: file,
          type: mimeType,
          size: fileStat.size,
          path: filePath,
          buffer: fileBuffer,
        },
      });
      
      allFiles.push(uploadedFile[0]);
    } else {
      console.log(`File not found: ${file}`);
    }
  }
  
  return allFiles.length === 1 ? allFiles[0] : allFiles;
}

async function createEventPage(entry) {
  return strapi.entityService.create('api::event-page.event-page', {
    data: {
      ...entry,
      publishedAt: new Date(),
    },
  });
}

async function seedEventPages() {
  try {
    console.log('Creating test event pages...');
    
    // Upload gallery images
    const galleryImages = await checkFileExistsBeforeUpload([
      'coffee-art.jpg',
      'coffee-beans.jpg', 
      'coffee-shadow.jpg',
      'beautiful-picture.jpg',
      'we-love-pizza.jpg'
    ]);
    
    // Upload main event image
    const mainImage = await checkFileExistsBeforeUpload(['coffee-art.jpg']);
    
    // Create wedding event page
    await createEventPage({
      Slug: 'wedding-catering',
      title: 'Свадебный кейтеринг',
      Description: `
# Свадебный кейтеринг

Создаем незабываемые моменты для вашего особенного дня. Наш свадебный кейтеринг включает:

- **Элегантные блюда** для торжественного ужина
- **Красивое оформление** столов и блюд
- **Профессиональное обслуживание** на протяжении всего мероприятия
- **Индивидуальный подход** к каждому заказу

Мы понимаем, что свадьба - это особенный день, и делаем все возможное, чтобы он стал незабываемым.
      `,
      Images: mainImage,
      GaleryOfMedia: {
        Title: 'Галерея свадебных мероприятий',
        Images: galleryImages,
        backgroundImg: [galleryImages[0]]
      }
    });
    
    // Create corporate event page
    await createEventPage({
      Slug: 'corporate-events',
      title: 'Корпоративные мероприятия',
      Description: `
# Корпоративные мероприятия

Организуем питание для ваших корпоративных событий:

- **Деловые встречи** и переговоры
- **Конференции** и семинары
- **Корпоративные праздники** и тимбилдинги
- **Кофе-брейки** и фуршеты

Гарантируем качество, пунктуальность и профессиональный подход.
      `,
      Images: mainImage,
      GaleryOfMedia: {
        Title: 'Наши корпоративные проекты',
        Images: galleryImages.slice(0, 3),
        backgroundImg: [galleryImages[1]]
      }
    });
    
    // Create birthday event page
    await createEventPage({
      Slug: 'birthday-parties',
      title: 'Дни рождения',
      Description: `
# Дни рождения

Делаем детские и взрослые дни рождения особенными:

- **Детские праздники** с веселыми блюдами
- **Взрослые торжества** с изысканной кухней
- **Тематические вечеринки** с соответствующим меню
- **Семейные праздники** для всех возрастов

Создаем атмосферу радости и веселья!
      `,
      Images: mainImage,
      GaleryOfMedia: {
        Title: 'Праздничные моменты',
        Images: galleryImages.slice(1, 4),
        backgroundImg: [galleryImages[2]]
      }
    });
    
    console.log('Event pages created successfully!');
    
  } catch (error) {
    console.error('Error creating event pages:', error);
    throw error;
  }
}

async function main() {
  try {
    await seedEventPages();
    process.exit(0);
  } catch (error) {
    console.error('Script failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { seedEventPages };
