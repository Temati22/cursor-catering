const axios = require('axios');

const API_BASE = 'http://localhost:1337/api';

async function seedInitialData() {
  try {
    console.log('🌱 Заполнение начальных данных...');

    // 1. Создаем Global данные
    console.log('📝 Создание Global данных...');
    try {
      const globalData = {
        data: {
          siteName: "Hi Catering",
          siteDescription: "Профессиональный кейтеринг для любых мероприятий",
          heroTitle: "Добро пожаловать в Hi Catering",
          heroSubtitle: "Профессиональный кейтеринг",
          heroDescription: "Мы создаем незабываемые кулинарные впечатления для ваших мероприятий"
        }
      };

      const globalResponse = await axios.put(`${API_BASE}/globals`, globalData);
      console.log('✅ Global данные созданы');
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('ℹ️  Global данные нужно создать через админ-панель');
      } else {
        console.log('❌ Ошибка при создании Global данных:', error.message);
      }
    }

    // 2. Создаем категории
    console.log('📝 Создание категорий...');
    const categories = [
      { name: "Горячие блюда", slug: "hot-dishes", description: "Основные горячие блюда" },
      { name: "Холодные закуски", slug: "cold-appetizers", description: "Холодные закуски и салаты" },
      { name: "Десерты", slug: "desserts", description: "Сладкие блюда и десерты" },
      { name: "Напитки", slug: "beverages", description: "Напитки и коктейли" }
    ];

    for (const category of categories) {
      try {
        await axios.post(`${API_BASE}/categories`, { data: category });
        console.log(`✅ Категория "${category.name}" создана`);
      } catch (error) {
        console.log(`ℹ️  Категория "${category.name}" уже существует или ошибка:`, error.response?.data?.error?.message || error.message);
      }
    }

    // 3. Создаем несколько блюд
    console.log('📝 Создание блюд...');
    const dishes = [
      {
        name: "Стейк из говядины",
        slug: "beef-steak",
        description: "Сочный стейк из говядины с овощами",
        price: 1200,
        currency: "руб",
        ingredients: "Говядина, овощи, специи",
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: true,
        preparationTime: 30,
        servingSize: "1 порция"
      },
      {
        name: "Цезарь с курицей",
        slug: "caesar-chicken",
        description: "Классический салат Цезарь с курицей",
        price: 450,
        currency: "руб",
        ingredients: "Салат, курица, сухарики, соус",
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: false,
        preparationTime: 15,
        servingSize: "1 порция"
      },
      {
        name: "Тирамису",
        slug: "tiramisu",
        description: "Классический итальянский десерт",
        price: 350,
        currency: "руб",
        ingredients: "Маскарпоне, кофе, какао, сахар",
        isVegetarian: true,
        isVegan: false,
        isGlutenFree: false,
        preparationTime: 20,
        servingSize: "1 порция"
      }
    ];

    for (const dish of dishes) {
      try {
        await axios.post(`${API_BASE}/dishes`, { data: dish });
        console.log(`✅ Блюдо "${dish.name}" создано`);
      } catch (error) {
        console.log(`ℹ️  Блюдо "${dish.name}" уже существует или ошибка:`, error.response?.data?.error?.message || error.message);
      }
    }

    // 4. Создаем контактную информацию
    console.log('📝 Создание контактной информации...');
    try {
      const contactData = {
        data: {
          phone1: "+7 (999) 123-45-67",
          phone2: "+7 (999) 765-43-21",
          email: "info@hicatering.ru",
          address: "г. Москва, ул. Примерная, д. 123"
        }
      };

      await axios.post(`${API_BASE}/contacts`, contactData);
      console.log('✅ Контактная информация создана');
    } catch (error) {
      console.log('ℹ️  Контактная информация уже существует или ошибка:', error.response?.data?.error?.message || error.message);
    }

    console.log('✅ Заполнение начальных данных завершено!');
    console.log('');
    console.log('📋 Что нужно сделать вручную:');
    console.log('1. Зайти в админ-панель: http://localhost:1337/admin');
    console.log('2. Создать Global запись в разделе "Single Types"');
    console.log('3. Настроить права доступа в Settings → Users & Permissions → Roles → Public');
    console.log('4. Добавить изображения к блюдам и меню');

  } catch (error) {
    console.error('❌ Ошибка при заполнении данных:', error.message);
  }
}

seedInitialData();
