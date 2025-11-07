'use strict';

const fs = require('fs-extra');
const path = require('path');
const mime = require('mime-types');

// Полные тестовые данные для кейтеринга
const testData = {
  categories: [
    { name: 'Супы', slug: 'soups', description: 'Горячие и холодные супы' },
    { name: 'Салаты', slug: 'salads', description: 'Свежие овощные и мясные салаты' },
    { name: 'Горячие блюда', slug: 'main-courses', description: 'Мясные и рыбные горячие блюда' },
    { name: 'Десерты', slug: 'desserts', description: 'Сладкие блюда и выпечка' },
    { name: 'Напитки', slug: 'beverages', description: 'Горячие и холодные напитки' },
    { name: 'Закуски', slug: 'appetizers', description: 'Холодные и горячие закуски' },
  ],

  dishes: [
    // Супы
    {
      name: 'Борщ с говядиной',
      slug: 'borscht-with-beef',
      description: 'Наваристый борщ из свеклы с говядиной и сметаной',
      price: 450,
      currency: 'руб',
      ingredients: 'Свекла, говядина, капуста, морковь, лук, томатная паста, сметана',
      allergens: 'Молочные продукты',
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: true,
      isSpicy: false,
      preparationTime: 60,
      servingSize: '350 мл',
      type: 'hot',
      category: 'soups',
    },
    {
      name: 'Солянка мясная',
      slug: 'meat-solyanka',
      description: 'Ароматная мясная солянка с солеными огурцами и маслинами',
      price: 480,
      currency: 'руб',
      ingredients: 'Различные виды мяса, соленые огурцы, маслины, каперсы, лимон',
      allergens: 'Может содержать глютен',
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
      isSpicy: true,
      preparationTime: 45,
      servingSize: '350 мл',
      type: 'hot',
      category: 'soups',
    },
    {
      name: 'Суп-пюре из грибов',
      slug: 'cream-of-mushroom-soup',
      description: 'Нежный грибной крем-суп с домашними гренками',
      price: 380,
      currency: 'руб',
      ingredients: 'Грибы (шампиньоны, белые), сливки, лук, тимьян, гренки',
      allergens: 'Молочные продукты, глютен',
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false,
      isSpicy: false,
      preparationTime: 30,
      servingSize: '300 мл',
      type: 'hot',
      category: 'soups',
    },
    
    // Салаты
    {
      name: 'Цезарь с курицей',
      slug: 'caesar-with-chicken',
      description: 'Классический цезарь с куриной грудкой, пармезаном и соусом цезарь',
      price: 520,
      currency: 'руб',
      ingredients: 'Салат айсберг, куриная грудка, пармезан, крутоны, соус цезарь',
      allergens: 'Молочные продукты, глютен',
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
      isSpicy: false,
      preparationTime: 15,
      servingSize: '250 г',
      type: 'cold',
      category: 'salads',
    },
    {
      name: 'Греческий салат',
      slug: 'greek-salad',
      description: 'Свежие овощи с фетой, маслинами и оливковым маслом',
      price: 420,
      currency: 'руб',
      ingredients: 'Помидоры, огурцы, перец, лук, фета, маслины, оливковое масло',
      allergens: 'Молочные продукты',
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: true,
      isSpicy: false,
      preparationTime: 10,
      servingSize: '250 г',
      type: 'cold',
      category: 'salads',
    },
    {
      name: 'Салат из свеклы с козьим сыром',
      slug: 'beetroot-goat-cheese-salad',
      description: 'Запеченная свекла с козьим сыром и грецкими орехами',
      price: 480,
      currency: 'руб',
      ingredients: 'Свекла, козий сыр, грецкие орехи, руккола, бальзамик',
      allergens: 'Орехи, молочные продукты',
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: true,
      isSpicy: false,
      preparationTime: 20,
      servingSize: '200 г',
      type: 'cold',
      category: 'salads',
    },
    
    // Горячие блюда
    {
      name: 'Стейк из говядины',
      slug: 'beef-steak',
      description: 'Сочный стейк из говядины с овощами на гриле',
      price: 1200,
      currency: 'руб',
      ingredients: 'Говядина, перец болгарский, кабачок, картофель, розмарин',
      allergens: 'Нет',
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: true,
      isSpicy: false,
      preparationTime: 25,
      servingSize: '250 г',
      type: 'hot',
      category: 'main-courses',
    },
    {
      name: 'Лосось на пару с овощами',
      slug: 'steamed-salmon',
      description: 'Нежный лосось на пару с овощами и соусом бернэз',
      price: 980,
      currency: 'руб',
      ingredients: 'Лосось, брокколи, морковь, стручковая фасоль, соус бернэз',
      allergens: 'Рыба, молочные продукты',
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: true,
      isSpicy: false,
      preparationTime: 20,
      servingSize: '200 г',
      type: 'hot',
      category: 'main-courses',
    },
    {
      name: 'Вегетарианская лазанья',
      slug: 'vegetarian-lasagna',
      description: 'Лазанья с овощами, шпинатом и моцареллой',
      price: 650,
      currency: 'руб',
      ingredients: 'Листы лазаньи, шпинат, грибы, помидоры, моцарелла, соус бешамель',
      allergens: 'Молочные продукты, глютен',
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false,
      isSpicy: false,
      preparationTime: 45,
      servingSize: '300 г',
      type: 'baked',
      category: 'main-courses',
    },
    {
      name: 'Куриные крылышки барбекю',
      slug: 'bbq-chicken-wings',
      description: 'Хрустящие куриные крылышки в соусе барбекю',
      price: 580,
      currency: 'руб',
      ingredients: 'Куриные крылышки, соус барбекю, специи',
      allergens: 'Нет',
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
      isSpicy: true,
      preparationTime: 30,
      servingSize: '500 г',
      type: 'hot',
      category: 'main-courses',
    },
    
    // Десерты
    {
      name: 'Тирамису',
      slug: 'tiramisu',
      description: 'Классический тирамису с маскарпоне и кофе',
      price: 450,
      currency: 'руб',
      ingredients: 'Маскарпоне, яйца, кофе, печенье савоярди, какао',
      allergens: 'Яйца, молочные продукты, глютен',
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false,
      isSpicy: false,
      preparationTime: 30,
      servingSize: '150 г',
      type: 'sweet',
      category: 'desserts',
    },
    {
      name: 'Чизкейк Нью-Йорк',
      slug: 'new-york-cheesecake',
      description: 'Нежный чизкейк с ягодным соусом',
      price: 420,
      currency: 'руб',
      ingredients: 'Творожный сыр, яйца, сливки, песочное основание, ягодный соус',
      allergens: 'Яйца, молочные продукты, глютен',
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false,
      isSpicy: false,
      preparationTime: 60,
      servingSize: '150 г',
      type: 'sweet',
      category: 'desserts',
    },
    {
      name: 'Шоколадный фондан',
      slug: 'chocolate-fondant',
      description: 'Теплый шоколадный десерт с жидкой начинкой и мороженым',
      price: 480,
      currency: 'руб',
      ingredients: 'Темный шоколад, масло, яйца, сахар, ванильное мороженое',
      allergens: 'Яйца, молочные продукты, глютен',
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false,
      isSpicy: false,
      preparationTime: 15,
      servingSize: '150 г',
      type: 'sweet',
      category: 'desserts',
    },
    
    // Напитки
    {
      name: 'Латте',
      slug: 'latte',
      description: 'Классический латте с молочной пеной',
      price: 180,
      currency: 'руб',
      ingredients: 'Эспрессо, молоко',
      allergens: 'Молочные продукты',
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: true,
      isSpicy: false,
      preparationTime: 5,
      servingSize: '250 мл',
      type: 'drink',
      category: 'beverages',
    },
    {
      name: 'Капучино',
      slug: 'cappuccino',
      description: 'Ароматный капучино с пышной пенкой',
      price: 170,
      currency: 'руб',
      ingredients: 'Эспрессо, молоко, молочная пена',
      allergens: 'Молочные продукты',
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: true,
      isSpicy: false,
      preparationTime: 5,
      servingSize: '180 мл',
      type: 'drink',
      category: 'beverages',
    },
    {
      name: 'Фреш из апельсинов',
      slug: 'orange-fresh',
      description: 'Свежевыжатый апельсиновый сок',
      price: 250,
      currency: 'руб',
      ingredients: 'Свежие апельсины',
      allergens: 'Нет',
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true,
      isSpicy: false,
      preparationTime: 5,
      servingSize: '250 мл',
      type: 'drink',
      category: 'beverages',
    },
    
    // Закуски
    {
      name: 'Брускетты с томатами и моцареллой',
      slug: 'bruschetta-tomato-mozzarella',
      description: 'Хрустящие брускетты с свежими томатами и моцареллой',
      price: 380,
      currency: 'руб',
      ingredients: 'Хлеб, помидоры, моцарелла, базилик, оливковое масло',
      allergens: 'Молочные продукты, глютен',
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false,
      isSpicy: false,
      preparationTime: 10,
      servingSize: '4 шт',
      type: 'cold',
      category: 'appetizers',
    },
    {
      name: 'Канапе с семгой',
      slug: 'salmon-canapes',
      description: 'Канапе из ржаного хлеба со слабосоленой семгой',
      price: 420,
      currency: 'руб',
      ingredients: 'Ржаной хлеб, семга, сливочный сыр, укроп, лимон',
      allergens: 'Рыба, молочные продукты, глютен',
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
      isSpicy: false,
      preparationTime: 15,
      servingSize: '6 шт',
      type: 'cold',
      category: 'appetizers',
    },
  ],

  menus: [
    {
      name: 'Кофе-брейк "Классический"',
      slug: 'coffee-break-classic',
      smallDescription: 'Идеально для деловых встреч и переговоров',
      description: 'Небольшой перекус для участников деловых встреч, включающий кофе, чай, соки, печенье и легкие закуски.',
      type: 'coffee-break',
      occasion: 'corporate',
      servingSize: 10,
      pricePerPerson: 450,
      currency: 'руб',
      isActive: true,
      dishes: ['latte', 'cappuccino', 'orange-fresh', 'bruschetta-tomato-mozzarella'],
    },
    {
      name: 'Обеденный сет "Бизнес"',
      slug: 'business-lunch',
      smallDescription: 'Сбалансированный обед для деловых встреч',
      description: 'Полноценный обед из трех блюд: салат, горячее блюдо и десерт. Идеально подходит для деловых обедов.',
      type: 'buffet',
      occasion: 'corporate',
      servingSize: 10,
      pricePerPerson: 1200,
      currency: 'руб',
      isActive: true,
      dishes: ['caesar-with-chicken', 'salmon-canapes', 'beef-steak', 'tiramisu'],
    },
    {
      name: 'Свадебный банкет "Премиум"',
      slug: 'wedding-banquet-premium',
      smallDescription: 'Изысканное меню для особенного дня',
      description: 'Роскошное меню для свадебного торжества с широким выбором блюд, включая горячие и холодные закуски, горячие блюда и десерты.',
      type: 'banquet',
      occasion: 'wedding',
      servingSize: 50,
      pricePerPerson: 3500,
      currency: 'руб',
      isActive: true,
      dishes: ['bruschetta-tomato-mozzarella', 'salmon-canapes', 'greek-salad', 'beef-steak', 'steamed-salmon', 'new-york-cheesecake'],
    },
    {
      name: 'Детский день рождения',
      slug: 'kids-birthday',
      smallDescription: 'Веселое меню для детского праздника',
      description: 'Красочное и вкусное меню для детского дня рождения с любимыми блюдами детей.',
      type: 'kids-menu',
      occasion: 'birthday',
      servingSize: 15,
      pricePerPerson: 800,
      currency: 'руб',
      isActive: true,
      dishes: ['borscht-with-beef', 'bbq-chicken-wings', 'chocolate-fondant'],
    },
    {
      name: 'Барбекю на природе',
      slug: 'bbq-outdoor',
      smallDescription: 'Отличное решение для пикника',
      description: 'Меню для барбекю на открытом воздухе с мясными блюдами на гриле и свежими салатами.',
      type: 'barbecue-banquet',
      occasion: 'casual',
      servingSize: 20,
      pricePerPerson: 1500,
      currency: 'руб',
      isActive: true,
      dishes: ['bbq-chicken-wings', 'beef-steak', 'greek-salad'],
    },
  ],

  eventPages: [
    {
      Slug: 'corporate-events',
      title: 'Корпоративные мероприятия',
      TitleInmenu: 'Корпоративы',
      Description: '<h2>Организация корпоративных мероприятий</h2><p>Мы предлагаем полный спектр услуг по организации корпоративных мероприятий любого масштаба. От небольших деловых встреч до масштабных корпоративных праздников.</p><p>Наша команда профессионалов поможет вам создать незабываемое мероприятие, которое оставит приятные впечатления у всех участников.</p>',
    },
    {
      Slug: 'weddings',
      title: 'Свадебный кейтеринг',
      TitleInmenu: 'Свадьбы',
      Description: '<h2>Свадебный кейтеринг премиум класса</h2><p>Ваша свадьба - это особенный день, и мы поможем сделать его идеальным. Изысканные блюда, безупречный сервис и внимание к каждой детали.</p><p>Мы предлагаем индивидуальный подход к каждой паре, создавая уникальное меню, которое отражает ваши вкусы и предпочтения.</p>',
    },
    {
      Slug: 'birthday-parties',
      title: 'Дни рождения',
      TitleInmenu: 'Дни рождения',
      Description: '<h2>Организация дней рождения</h2><p>Сделайте ваш день рождения незабываемым! Мы организуем праздники для детей и взрослых с учетом всех ваших пожеланий.</p><p>Разнообразное меню, красивое оформление и профессиональное обслуживание - все для вашего идеального праздника.</p>',
    },
  ],

  services: [
    {
      Title: 'Кейтеринг на мероприятия',
      TitleInmenu: 'Кейтеринг',
      slug: 'catering-services',
      ShortDescription: 'Профессиональный кейтеринг для любых мероприятий',
      Description: '<h2>Кейтеринг высокого уровня</h2><p>Мы предоставляем полный спектр кейтеринговых услуг для мероприятий любого формата и масштаба. Наша команда профессионалов обеспечит безупречное обслуживание и изысканную кухню.</p><ul><li>Корпоративные мероприятия</li><li>Свадьбы и банкеты</li><li>Частные вечеринки</li><li>Конференции и семинары</li></ul>',
      order: 1,
    },
    {
      Title: 'Организация банкетов',
      TitleInmenu: 'Банкеты',
      slug: 'banquet-organization',
      ShortDescription: 'Организация банкетов под ключ',
      Description: '<h2>Банкеты любого формата</h2><p>От камерных семейных торжеств до масштабных банкетов - мы организуем мероприятия любой сложности. Индивидуальный подход, качественная кухня и безупречный сервис.</p>',
      order: 2,
    },
    {
      Title: 'Выездное обслуживание',
      TitleInmenu: 'Выездное обслуживание',
      slug: 'outdoor-catering',
      ShortDescription: 'Кейтеринг на выезде',
      Description: '<h2>Выездной кейтеринг</h2><p>Организуем мероприятия на любой площадке: в парке, на природе, на яхте или в любом другом месте. Полное техническое оснащение и профессиональная команда.</p>',
      order: 3,
    },
  ],

  advantages: [
    {
      Title: 'Качественные продукты',
      slug: 'quality-products',
      Description: '<p>Мы используем только свежие и качественные продукты от проверенных поставщиков. Каждое блюдо готовится с любовью и вниманием к деталям.</p>',
    },
    {
      Title: 'Профессиональная команда',
      slug: 'professional-team',
      Description: '<p>Наша команда состоит из опытных поваров и обслуживающего персонала, которые обеспечат высокий уровень сервиса на вашем мероприятии.</p>',
    },
    {
      Title: 'Индивидуальный подход',
      slug: 'individual-approach',
      Description: '<p>Мы учитываем все ваши пожелания и создаем уникальное меню специально для вашего мероприятия. Гибкость и внимание к деталям - наши главные принципы.</p>',
    },
    {
      Title: 'Доступные цены',
      slug: 'affordable-prices',
      Description: '<p>Мы предлагаем конкурентные цены без ущерба качеству. Различные пакеты услуг позволяют выбрать оптимальный вариант для любого бюджета.</p>',
    },
  ],

  global: {
    siteName: 'Hi Catering',
    siteDescription: 'Профессиональный кейтеринг для любых мероприятий. Организация банкетов, корпоративов, свадеб и частных вечеринок. Индивидуальный подход и безупречное качество.',
    heroTitle: 'Добро пожаловать в Hi Catering',
    heroSubtitle: 'Профессиональный кейтеринг премиум класса',
    heroDescription: 'Мы создаем незабываемые кулинарные впечатления для ваших мероприятий. Изысканная кухня, безупречный сервис и внимание к каждой детали.',
    aboutText1: 'Hi Catering - это команда профессионалов с многолетним опытом в сфере кейтеринга и организации мероприятий. Мы специализируемся на проведении мероприятий любого формата и масштаба.',
    aboutText2: 'Наша миссия - делать каждое мероприятие особенным. Мы используем только качественные продукты, современное оборудование и применяем лучшие практики в области кейтеринга.',
  },

  contacts: {
    title: 'Свяжитесь с нами',
    description: 'Мы всегда рады ответить на ваши вопросы и помочь организовать идеальное мероприятие',
    phone1: '+7 (999) 123-45-67',
    phone2: '+7 (999) 765-43-21',
    email: 'info@hicatering.ru',
    address: 'г. Москва, ул. Примерная, д. 123, офис 456',
    workingHours: 'Пн-Пт: 9:00 - 21:00, Сб-Вс: 10:00 - 20:00',
    telegram: 'https://t.me/hicatering',
    whatsapp: '+79991234567',
    instagram: 'https://instagram.com/hicatering',
    vk: 'https://vk.com/hicatering',
  },
};

// Вспомогательные функции
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
    console.error('Ошибка загрузки файла:', error);
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
      console.error(`Ошибка обработки файла ${fileName}:`, error);
    }
  }
  
  const allFiles = [...existingFiles, ...uploadedFiles];
  return allFiles.length === 1 ? allFiles[0] : allFiles;
}

async function setPublicPermissions(newPermissions) {
  try {
    const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
      where: {
        type: 'public',
      },
    });
    
    if (!publicRole) {
      console.error('Публичная роль не найдена');
      return;
    }
    
    const allPermissionsToCreate = [];
    Object.keys(newPermissions).map((controller) => {
      const actions = newPermissions[controller];
      const permissionsToCreate = actions.map((action) => {
        return strapi.query('plugin::users-permissions.permission').create({
          data: {
            action: `api::${controller}.${controller}.${action}`,
            role: publicRole.id,
          },
        });
      });
      allPermissionsToCreate.push(...permissionsToCreate);
    });
    await Promise.all(allPermissionsToCreate);
    console.log('✓ Права доступа настроены');
  } catch (error) {
    console.error('Ошибка настройки прав доступа:', error);
  }
}

async function createEntry({ model, entry }) {
  try {
    await strapi.documents(`api::${model}.${model}`).create({
      data: entry,
    });
    console.log(`✓ Создано ${model}: ${entry.name || entry.Title || entry.title || entry.siteName || 'запись'}`);
  } catch (error) {
    console.error(`✗ Ошибка создания ${model}:`, error.message);
  }
}

async function importCategories() {
  console.log('\n📂 Импорт категорий...');
  for (const category of testData.categories) {
    await createEntry({ model: 'category', entry: category });
  }
}

async function importDishes() {
  console.log('\n🍽️ Импорт блюд...');
  const categoryMap = {};
  
  // Получаем категории
  const categories = await strapi.query('api::category.category').findMany();
  categories.forEach(cat => {
    categoryMap[cat.slug] = cat.id;
  });
  
  // Загружаем изображения для блюд
  const dishImages = await checkFileExistsBeforeUpload([
    'coffee-art.jpg',
    'coffee-beans.jpg',
    'beautiful-picture.jpg',
    'we-love-pizza.jpg',
  ]);
  
  for (const dish of testData.dishes) {
    const categoryId = categoryMap[dish.category];
    
    await createEntry({
      model: 'dish',
      entry: {
        ...dish,
        category: categoryId,
        images: dishImages,
        publishedAt: Date.now(),
      },
    });
  }
}

async function importMenus() {
  console.log('\n📋 Импорт меню...');
  
  const menuImages = await checkFileExistsBeforeUpload([
    'coffee-art.jpg',
    'beautiful-picture.jpg',
  ]);
  
  // Получаем блюда
  const dishes = await strapi.query('api::dish.dish').findMany({
    populate: true,
  });
  
  const dishSlugMap = {};
  dishes.forEach(dish => {
    dishSlugMap[dish.slug] = dish.id;
  });
  
  for (const menu of testData.menus) {
    const dishIds = menu.dishes
      .map(slug => dishSlugMap[slug])
      .filter(id => id !== undefined);
    
    await createEntry({
      model: 'menu',
      entry: {
        ...menu,
        dishes: dishIds,
        image: menuImages,
        publishedAt: Date.now(),
      },
    });
  }
}

async function importEventPages() {
  console.log('\n🎉 Импорт страниц мероприятий...');
  
  const eventImages = await checkFileExistsBeforeUpload([
    'beautiful-picture.jpg',
    'coffee-art.jpg',
  ]);
  
  for (const eventPage of testData.eventPages) {
    await createEntry({
      model: 'event-page',
      entry: {
        ...eventPage,
        Images: eventImages,
        publishedAt: Date.now(),
      },
    });
  }
}

async function importServices() {
  console.log('\n🛎️ Импорт услуг...');
  
  const serviceImages = await checkFileExistsBeforeUpload([
    'coffee-art.jpg',
    'beautiful-picture.jpg',
  ]);
  
  for (const service of testData.services) {
    await createEntry({
      model: 'service',
      entry: {
        ...service,
        Images: serviceImages,
        publishedAt: Date.now(),
      },
    });
  }
}

async function importAdvantages() {
  console.log('\n⭐ Импорт преимуществ...');
  
  const advantageImages = await checkFileExistsBeforeUpload([
    'coffee-beans.jpg',
  ]);
  
  for (const advantage of testData.advantages) {
    await createEntry({
      model: 'advantage',
      entry: {
        ...advantage,
        image: advantageImages[0] || advantageImages,
        publishedAt: Date.now(),
      },
    });
  }
}

async function importGlobal() {
  console.log('\n⚙️ Импорт глобальных настроек...');
  
  const favicon = await checkFileExistsBeforeUpload(['favicon.png']);
  const heroImage = await checkFileExistsBeforeUpload(['beautiful-picture.jpg']);
  const aboutImage = await checkFileExistsBeforeUpload(['coffee-art.jpg']);
  
  try {
    await strapi.documents('api::global.global').create({
      data: {
        ...testData.global,
        favicon,
        heroImage,
        aboutImage,
      },
    });
    console.log('✓ Глобальные настройки созданы');
  } catch (error) {
    console.error('✗ Ошибка создания глобальных настроек:', error.message);
  }
}

async function importContacts() {
  console.log('\n📞 Импорт контактов...');
  
  try {
    await strapi.documents('api::contacts.contacts').create({
      data: testData.contacts,
    });
    console.log('✓ Контакты созданы');
  } catch (error) {
    console.error('✗ Ошибка создания контактов:', error.message);
  }
}

async function importSeedData() {
  console.log('🚀 Начало заполнения данными...\n');
  
  try {
    // Настройка прав доступа
    await setPublicPermissions({
      dish: ['find', 'findOne'],
      menu: ['find', 'findOne'],
      category: ['find', 'findOne'],
      global: ['find'],
      contacts: ['find'],
      'event-page': ['find', 'findOne'],
      service: ['find', 'findOne'],
      advantage: ['find', 'findOne'],
    });
    
    // Импорт данных
    await importCategories();
    await importDishes();
    await importMenus();
    await importEventPages();
    await importServices();
    await importAdvantages();
    await importGlobal();
    await importContacts();
    
    console.log('\n✅ Все данные успешно импортированы!');
    console.log('\n📋 Что дальше:');
    console.log('1. Зайдите в админ-панель: http://localhost:1337/admin');
    console.log('2. Проверьте созданные данные');
    console.log('3. При необходимости добавьте дополнительные изображения');
    console.log('4. Настройте дополнительные параметры SEO');
  } catch (error) {
    console.error('\n❌ Ошибка импорта данных:', error);
    throw error;
  }
}

async function main() {
  const { createStrapi, compileStrapi } = require('@strapi/strapi');
  
  console.log('📦 Загрузка Strapi...');
  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();
  
  app.log.level = 'error';
  
  await importSeedData();
  await app.destroy();
  
  process.exit(0);
}

main().catch((error) => {
  console.error('Критическая ошибка:', error);
  process.exit(1);
});

