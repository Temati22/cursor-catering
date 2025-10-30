'use strict';

const fs = require('fs-extra');
const path = require('path');
const mime = require('mime-types');
const { Strapi } = require('@strapi/strapi');

// Helper functions
function getFileSizeInBytes(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats['size'];
  } catch {
    return 0;
  }
}

function getFileData(fileName) {
  const filePath = path.join('data', 'uploads', fileName);
  const ext = fileName.split('.').pop();
  const mimeType = mime.lookup(ext || '') || '';
  
  return {
    filepath: filePath,
    originalFileName: fileName,
    size: getFileSizeInBytes(filePath),
    mimetype: mimeType,
  };
}

async function uploadFile(file, name) {
  try {
    return await strapi
      .plugin('upload')
      .service('upload')
      .upload({
        files: file,
        data: {
          fileInfo: {
            alternativeText: `Изображение для ${name}`,
            caption: name,
            name,
          },
        },
      });
  } catch (error) {
    console.error('Error uploading file:', error);
    return null;
  }
}

async function checkFileExistsBeforeUpload(fileNames) {
  const existingFiles = [];
  const uploadedFiles = [];
  
  for (const fileName of fileNames) {
    try {
      const fileWhereName = await strapi.query('plugin::upload.file').findOne({
        where: {
          name: fileName.replace(/\..*$/, ''),
        },
      });
      
      if (fileWhereName) {
        existingFiles.push(fileWhereName);
      } else {
        const fileData = getFileData(fileName);
        if (fs.existsSync(fileData.filepath)) {
          const fileNameNoExtension = fileName.split('.').shift();
          const [file] = await uploadFile(fileData, fileNameNoExtension);
          if (file) uploadedFiles.push(file);
        }
      }
    } catch (error) {
      console.error(`Error processing file ${fileName}:`, error);
    }
  }
  
  const allFiles = [...existingFiles, ...uploadedFiles];
  return allFiles.length === 1 ? allFiles[0] : allFiles;
}

async function checkEventPageExists(slug) {
  // Always return false since we clean at the start
  return false;
}

async function createEventPage(entry) {
  try {
    // Check if page already exists
    const exists = await checkEventPageExists(entry.Slug);
    if (exists) {
      console.log(`⊘ Skip - already exists: ${entry.title} (${entry.Slug})`);
      return false;
    }
    
    await strapi.documents('api::event-page.event-page').create({
      data: {
        ...entry,
        publishedAt: new Date(),
      },
    });
    console.log(`✓ Created: ${entry.title}`);
    return true;
  } catch (error) {
    console.error(`✗ Error creating ${entry.title}:`, error.message);
    throw error;
  }
}

async function seedEventPages() {
  try {
    console.log('Creating event pages for catering...\n');
    
    // Delete all existing event pages first
    const allPages = await strapi.entityService.findMany('api::event-page.event-page', {});
    if (allPages.length > 0) {
      console.log(`Deleting ${allPages.length} existing event pages...`);
      for (const page of allPages) {
        await strapi.entityService.delete('api::event-page.event-page', page.id);
      }
      console.log('✓ Cleaned existing pages\n');
    }
    
    // Get existing menus to attach to events
    const menus = await strapi.entityService.findMany('api::menu.menu', {
      populate: '*',
    });
    console.log(`Found ${menus.length} existing menus\n`);
    
    // Upload gallery images
    const galleryImages = await checkFileExistsBeforeUpload([
      'coffee-art.jpg',
      'coffee-beans.jpg', 
      'coffee-shadow.jpg',
      'beautiful-picture.jpg',
      'we-love-pizza.jpg',
      'this-shrimp-is-awesome.jpg'
    ]);
    
    // Upload main event images
    const weddingImage = await checkFileExistsBeforeUpload(['coffee-art.jpg']);
    const corporateImage = await checkFileExistsBeforeUpload(['beautiful-picture.jpg']);
    const birthdayImage = await checkFileExistsBeforeUpload(['we-love-pizza.jpg']);
    const anniversaryImage = await checkFileExistsBeforeUpload(['coffee-shadow.jpg']);
    const kidsImage = await checkFileExistsBeforeUpload(['this-shrimp-is-awesome.jpg']);
    
    // Filter menus by occasion for each event
    const weddingMenus = menus.filter(m => m.occasion === 'wedding').map(m => m.id);
    const corporateMenus = menus.filter(m => m.occasion === 'corporate').map(m => m.id);
    const birthdayMenus = menus.filter(m => m.occasion === 'birthday').map(m => m.id);
    
    // Create wedding event page
    await createEventPage({
      Slug: 'wedding-catering',
      title: 'Свадебный кейтеринг',
      Description: `
<p>Ваша свадьба - это особенный день, который навсегда останется в вашей памяти. Мы предлагаем профессиональный свадебный кейтеринг, который сделает ваше торжество незабываемым.</p>

<h3>Что входит в свадебный кейтеринг:</h3>
<ul>
  <li><strong>Элегантное банкетное меню</strong> - изысканные блюда от наших шеф-поваров</li>
  <li><strong>Красивая сервировка</strong> - оформление столов и блюд на высоком уровне</li>
  <li><strong>Профессиональное обслуживание</strong> - официанты с опытом работы на корпоративных мероприятиях</li>
  <li><strong>Алкогольная карта</strong> - подбор напитков под ваши блюда</li>
  <li><strong>Десерты и торт</strong> - сладкие угощения для ваших гостей</li>
</ul>

<h3>Форматы обслуживания:</h3>
<ul>
  <li>Банкетное обслуживание - классическое сидячее обслуживание</li>
  <li>Фуршет - идеально для большой компании</li>
  <li>Выездной бар - профессиональный бармен на вашем мероприятии</li>
</ul>

<p>Мы работаем с любым бюджетом и поможем создать идеальное меню для вашего торжества!</p>
      `,
      Images: weddingImage,
      GaleryOfMedia: {
        Title: 'Галерея наших свадебных мероприятий',
        Images: galleryImages,
        backgroundImg: [galleryImages[0]]
      },
      menus: weddingMenus.length > 0 ? [
        {
          __component: 'shared.menus-in-events',
          menus: weddingMenus
        }
      ] : [],
      SeoMenus: [
        {
          __component: 'shared.seo-menu-wrapper',
          Title: 'Почему выбирают наш свадебный кейтеринг?',
          Description: `
<p>Мы работаем на рынке кейтеринга более 5 лет и провели более 500 свадебных мероприятий. Наши клиенты выбирают нас за:</p>
<ul>
  <li>Индивидуальный подход к каждому мероприятию</li>
  <li>Высокое качество блюд и обслуживания</li>
  <li>Пунктуальность и надежность</li>
  <li>Гибкие условия сотрудничества</li>
</ul>
          `,
          SubTitle: 'Обращайтесь к нам для организации незабываемого торжества!'
        }
      ]
    });
    
    // Create corporate event page
    await createEventPage({
      Slug: 'corporate-events',
      title: 'Корпоративные мероприятия',
      Description: `
<p>Организуем питание для ваших корпоративных событий любой сложности. От деловых встреч до крупных конференций.</p>

<h3>Типы корпоративных мероприятий:</h3>
<ul>
  <li><strong>Деловые встречи и переговоры</strong> - кофе-брейки, ланчи, ужины</li>
  <li><strong>Конференции и семинары</strong> - организация питания на весь день</li>
  <li><strong>Корпоративные праздники</strong> - день компании, юбилеи, тимбилдинги</li>
  <li><strong>Выездные мероприятия</strong> - выезд на вашу территорию</li>
</ul>

<h3>Формат обслуживания:</h3>
<ul>
  <li>Кофе-брейк - идеально для перерывов между сессиями</li>
  <li>Бизнес-ланч - полноценный обед в рабочее время</li>
  <li>Фуршет - для вечерних мероприятий и торжеств</li>
  <li>Выездной бар - для праздничных корпоративов</li>
</ul>

<p>Гарантируем качество, пунктуальность и профессиональный подход к организации питания на вашем мероприятии.</p>
      `,
      Images: corporateImage,
      GaleryOfMedia: {
        Title: 'Наши корпоративные проекты',
        Images: galleryImages.slice(0, 4),
        backgroundImg: [galleryImages[1]]
      },
      menus: corporateMenus.length > 0 ? [
        {
          __component: 'shared.menus-in-events',
          menus: corporateMenus
        }
      ] : [],
      SeoMenus: [
        {
          __component: 'shared.seo-menu-wrapper',
          Title: 'Преимущества нашего корпоративного кейтеринга',
          Description: `
<p>Работаем с компаниями любого масштаба - от стартапов до крупных холдингов. Наши клиенты ценят нас за:</p>
<ul>
  <li>Гибкость в работе - адаптируемся под ваш формат и график</li>
  <li>Красивая подача - каждое блюдо оформлено с заботой</li>
  <li>Соблюдение сроков - никогда не подводим клиентов</li>
  <li>Конкурентные цены - оптимальное соотношение качества и стоимости</li>
</ul>
          `,
          SubTitle: 'Свяжитесь с нами для расчета стоимости вашего мероприятия!'
        }
      ]
    });
    
    console.log('✓ Corporate events page created');
    
    // Create birthday event page
    await createEventPage({
      Slug: 'birthday-parties',
      title: 'Дни рождения и юбилеи',
      Description: `
<p>Делаем детские и взрослые дни рождения особенными и незабываемыми. От детского праздника до взрослого торжества.</p>

<h3>Детские дни рождения:</h3>
<ul>
  <li><strong>Тематические вечеринки</strong> - под любой формат и предпочтения ребенка</li>
  <li><strong>Детское меню</strong> - вкусные и безопасные блюда для детей</li>
  <li><strong>Украшение</strong> - яркое оформление в тематике праздника</li>
  <li><strong>Развлекательная программа</strong> - дополняем питание развлечениями</li>
</ul>

<h3>Взрослые дни рождения и юбилеи:</h3>
<ul>
  <li>Изысканная кухня - от легких закусок до полноценного банкета</li>
  <li>Алкогольное сопровождение - подбор напитков под меню</li>
  <li>Красивая сервировка - для создания торжественной атмосферы</li>
  <li>Торт и десерты - завершение праздника</li>
</ul>

<p>Организуем праздник любого масштаба - от семейного застолья до вечеринки в ресторане!</p>
      `,
      Images: birthdayImage,
      GaleryOfMedia: {
        Title: 'Праздничные моменты',
        Images: galleryImages.slice(1, 5),
        backgroundImg: [galleryImages[2]]
      },
      menus: birthdayMenus.length > 0 ? [
        {
          __component: 'shared.menus-in-events',
          menus: birthdayMenus
        }
      ] : [],
      SeoMenus: [
        {
          __component: 'shared.seo-menu-wrapper',
          Title: 'Создаем незабываемые моменты',
          Description: `
<p>Наша команда понимает, как важен каждый праздник в вашей жизни. Мы подходим к организации питания с особой заботой:</p>
<ul>
  <li>Учитываем все пожелания именинника</li>
  <li>Создаем теплую и уютную атмосферу</li>
  <li>Предлагаем разнообразное меню на любой вкус</li>
  <li>Контролируем качество на всех этапах</li>
</ul>
          `,
          SubTitle: 'Подарите себе и близким незабываемый праздник!'
        }
      ]
    });
    
    // Create kids party event page
    await createEventPage({
      Slug: 'kids-parties',
      title: 'Детские праздники',
      Description: `
<p>Организуем незабываемые детские праздники! От дня рождения до выпускного, от праздника в детском саду до домашней вечеринки.</p>

<h3>Что мы предлагаем для детского праздника:</h3>
<ul>
  <li><strong>Специальное детское меню</strong> - вкусные и безопасные блюда</li>
  <li><strong>Яркое оформление</strong> - все в тематике вашего праздника</li>
  <li><strong>Здоровое питание</strong> - заботливость о здоровье ваших детей</li>
  <li><strong>Веселые угощения</strong> - пицца, наггетсы, картофель фри</li>
  <li><strong>Торты и сладости</strong> - вкусные десерты</li>
</ul>

<h3>Форматы детских праздников:</h3>
<ul>
  <li>Домашний праздник - выезд на дом с полным набором</li>
  <li>Праздник в кафе - организация в специальном детском заведении</li>
  <li>На природе - выезд на дачу или в парк</li>
</ul>

<p>Создаем для детей сказочную атмосферу и веселые воспоминания на всю жизнь!</p>
      `,
      Images: kidsImage,
      GaleryOfMedia: {
        Title: 'Радостные детские праздники',
        Images: galleryImages.slice(2, 6),
        backgroundImg: [galleryImages[3]]
      },
      menus: [],
      SeoMenus: [
        {
          __component: 'shared.seo-menu-wrapper',
          Title: 'Безопасность превыше всего',
          Description: `
<p>Мы понимаем ответственность, которая ложится на нас при организации питания для детей:</p>
<ul>
  <li>Используем только свежие и качественные продукты</li>
  <li>Учитываем аллергические реакции и пищевые ограничения</li>
  <li>Соблюдаем все санитарные нормы</li>
  <li>Предлагаем здоровую альтернативу фаст-фуду</li>
</ul>
          `,
          SubTitle: 'Позвольте нам сделать праздник вашего ребенка особенным!'
        }
      ]
    });
    
    // Create anniversary event page
    await createEventPage({
      Slug: 'anniversary-events',
      title: 'Юбилеи и годовщины',
      Description: `
<p>Организуем элегантные юбилейные торжества и празднование годовщин. От круглых дат до ежегодных празднований.</p>

<h3>Виды юбилейных мероприятий:</h3>
<ul>
  <li><strong>Семейные юбилеи</strong> - особенный день в кругу близких</li>
  <li><strong>Корпоративные юбилеи</strong> - празднование важной даты компании</li>
  <li><strong>Годовщины свадьбы</strong> - романтический ужин или торжество</li>
  <li><strong>Юбилеи институций</strong> - масштабные праздничные мероприятия</li>
</ul>

<h3>Особенности обслуживания:</h3>
<ul>
  <li>Торжественное меню - изысканные блюда для особенного дня</li>
  <li>Элегантная сервировка - оформление на высшем уровне</li>
  <li>Профессиональное обслуживание - официанты с безупречной репутацией</li>
  <li>Алкогольная карта - подбор премиальных напитков</li>
</ul>

<p>Делаем каждый юбилей незабываемым событием, достойным вашей важной даты!</p>
      `,
      Images: anniversaryImage,
      GaleryOfMedia: {
        Title: 'Юбилейные торжества',
        Images: galleryImages.slice(0, 5),
        backgroundImg: [galleryImages[4]]
      },
      menus: [],
      SeoMenus: [
        {
          __component: 'shared.seo-menu-wrapper',
          Title: 'Традиции и современность',
          Description: `
<p>Юбилей - это возможность отдать дань традициям и одновременно создать новые памятные моменты:</p>
<ul>
  <li>Уважаем семейные традиции в организации торжества</li>
  <li>Предлагаем современный подход к сервировке и подаче</li>
  <li>Учитываем особенности возрастных категорий гостей</li>
  <li>Создаем атмосферу достоинства и уважения</li>
</ul>
          `,
          SubTitle: 'Организуем юбилей, достойный вашей важной даты!'
        }
      ]
    });
    
    console.log('\n✅ All event pages processed successfully!');
    
  } catch (error) {
    console.error('❌ Error creating event pages:', error);
    throw error;
  }
}

async function main() {
  const { createStrapi, compileStrapi } = require('@strapi/strapi');
  
  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();
  
  app.log.level = 'error';
  
  // Make strapi available globally for the script
  global.strapi = app;
  
  try {
    await seedEventPages();
    console.log('\n✨ Seeding completed successfully!');
    await app.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Script failed:', error);
    await app.destroy();
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { seedEventPages };
