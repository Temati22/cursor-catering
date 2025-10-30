'use strict';

const fs = require('fs-extra');
const path = require('path');
const mime = require('mime-types');

// Test data for catering site
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
    // Soups
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
      category: 'soups',
    },
    
    // Salads
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
      category: 'salads',
    },
    
    // Main courses
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
      category: 'main-courses',
    },
    
    // Desserts
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
      category: 'desserts',
    },
    
    // Beverages
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
      category: 'beverages',
    },
    
    // Appetizers
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
      dishes: ['latte', 'orange-fresh', 'bruschetta-tomato-mozzarella'],
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
  ],

  global: {
  }
};

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

async function setPublicPermissions(newPermissions) {
  try {
    const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
      where: {
        type: 'public',
      },
    });
    
    if (!publicRole) {
      console.error('Public role not found');
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
  } catch (error) {
    console.error('Error setting public permissions:', error);
  }
}

async function createEntry({ model, entry }) {
  try {
    await strapi.documents(`api::${model}.${model}`).create({
      data: entry,
    });
    console.log(`✓ Created ${model}: ${entry.name || entry.siteName || entry.title}`);
  } catch (error) {
    console.error(`✗ Error creating ${model}:`, error.message);
  }
}

async function importCategories() {
  console.log('\n📂 Importing categories...');
  for (const category of testData.categories) {
    await createEntry({ model: 'category', entry: category });
  }
}

async function importDishes() {
  console.log('\n🍽️ Importing dishes...');
  const categoryMap = {};
  
  // Get categories
  const categories = await strapi.query('api::category.category').findMany();
  categories.forEach(cat => {
    categoryMap[cat.slug] = cat.id;
  });
  
  // Upload images for dishes
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
  console.log('\n🍽️ Importing menus...');
  
  const menuImages = await checkFileExistsBeforeUpload([
    'coffee-art.jpg',
    'beautiful-picture.jpg',
  ]);
  
  // Get dishes
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

async function importGlobal() {
  console.log('\n⚙️ Importing global settings...');
  
  const favicon = await checkFileExistsBeforeUpload(['favicon.png']);
  const heroImage = await checkFileExistsBeforeUpload(['beautiful-picture.jpg']);
  const aboutImage = await checkFileExistsBeforeUpload(['coffee-art.jpg']);
  const shareImage = await checkFileExistsBeforeUpload(['default-image.png']);
  
  await createEntry({
    model: 'global',
    entry: {
      ...testData.global,
      favicon,
      heroImage,
      aboutImage,
      defaultSeo: {
        ...testData.global.defaultSeo,
        shareImage,
      },
      publishedAt: Date.now(),
    },
  });
}

async function importContacts() {
  console.log('\n📞 Importing contacts...');
  
  await createEntry({
    model: 'contacts',
    entry: {
      ...testData.contacts,
      publishedAt: Date.now(),
    },
  });
}

async function importSeedData() {
  console.log('🚀 Starting catering data seed...\n');
  
  try {
    // Set public permissions
    await setPublicPermissions({
      dish: ['find', 'findOne'],
      menu: ['find', 'findOne'],
      category: ['find', 'findOne'],
      global: ['find', 'findOne'],
      contacts: ['find', 'findOne'],
    });
    
    // Import data
    await importCategories();
    await importDishes();
    await importMenus();
    await importGlobal();
    await importContacts();
    
    console.log('\n✅ Catering data imported successfully!');
  } catch (error) {
    console.error('\n❌ Error importing data:', error);
    throw error;
  }
}

async function main() {
  const { createStrapi, compileStrapi } = require('@strapi/strapi');
  
  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();
  
  app.log.level = 'error';
  
  await importSeedData();
  await app.destroy();
  
  process.exit(0);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
