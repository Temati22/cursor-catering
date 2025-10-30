'use strict';

const fs = require('fs-extra');
const path = require('path');
const mime = require('mime-types');
const { categories, authors, articles, global, about } = require('../data/data.json');

async function seedExampleApp() {
  const shouldImportSeedData = await isFirstRun();

  if (shouldImportSeedData) {
    try {
      console.log('Setting up the template...');
      await importSeedData();
      console.log('Ready to go');
    } catch (error) {
      console.log('Could not import seed data');
      console.error(error);
    }
  } else {
    console.log(
      'Seed data has already been imported. We cannot reimport unless you clear your database first.'
    );
  }
}

async function isFirstRun() {
  const pluginStore = strapi.store({
    environment: strapi.config.environment,
    type: 'type',
    name: 'setup',
  });
  const initHasRun = await pluginStore.get({ key: 'initHasRun' });
  await pluginStore.set({ key: 'initHasRun', value: true });
  return !initHasRun;
}

async function setPublicPermissions(newPermissions) {
  // Find the ID of the public role
  const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
    where: {
      type: 'public',
    },
  });

  // Create the new permissions and link them to the public role
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
}

function getFileSizeInBytes(filePath) {
  const stats = fs.statSync(filePath);
  const fileSizeInBytes = stats['size'];
  return fileSizeInBytes;
}

function getFileData(fileName) {
  const filePath = path.join('data', 'uploads', fileName);
  // Parse the file metadata
  const size = getFileSizeInBytes(filePath);
  const ext = fileName.split('.').pop();
  const mimeType = mime.lookup(ext || '') || '';

  return {
    filepath: filePath,
    originalFileName: fileName,
    size,
    mimetype: mimeType,
  };
}

async function uploadFile(file, name) {
  return strapi
    .plugin('upload')
    .service('upload')
    .upload({
      files: file,
      data: {
        fileInfo: {
          alternativeText: `An image uploaded to Strapi called ${name}`,
          caption: name,
          name,
        },
      },
    });
}

// Create an entry and attach files if there are any
async function createEntry({ model, entry }) {
  try {
    // Actually create the entry in Strapi
    await strapi.documents(`api::${model}.${model}`).create({
      data: entry,
    });
  } catch (error) {
    console.error({ model, entry, error });
  }
}

async function checkFileExistsBeforeUpload(files) {
  const existingFiles = [];
  const uploadedFiles = [];
  const filesCopy = [...files];

  for (const fileName of filesCopy) {
    // Check if the file already exists in Strapi
    const fileWhereName = await strapi.query('plugin::upload.file').findOne({
      where: {
        name: fileName.replace(/\..*$/, ''),
      },
    });

    if (fileWhereName) {
      // File exists, don't upload it
      existingFiles.push(fileWhereName);
    } else {
      // File doesn't exist, upload it
      const fileData = getFileData(fileName);
      const fileNameNoExtension = fileName.split('.').shift();
      const [file] = await uploadFile(fileData, fileNameNoExtension);
      uploadedFiles.push(file);
    }
  }
  const allFiles = [...existingFiles, ...uploadedFiles];
  // If only one file then return only that file
  return allFiles.length === 1 ? allFiles[0] : allFiles;
}

async function updateBlocks(blocks) {
  const updatedBlocks = [];
  for (const block of blocks) {
    if (block.__component === 'shared.media') {
      const uploadedFiles = await checkFileExistsBeforeUpload([block.file]);
      // Copy the block to not mutate directly
      const blockCopy = { ...block };
      // Replace the file name on the block with the actual file
      blockCopy.file = uploadedFiles;
      updatedBlocks.push(blockCopy);
    } else if (block.__component === 'shared.slider') {
      // Get files already uploaded to Strapi or upload new files
      const existingAndUploadedFiles = await checkFileExistsBeforeUpload(block.files);
      // Copy the block to not mutate directly
      const blockCopy = { ...block };
      // Replace the file names on the block with the actual files
      blockCopy.files = existingAndUploadedFiles;
      // Push the updated block
      updatedBlocks.push(blockCopy);
    } else {
      // Just push the block as is
      updatedBlocks.push(block);
    }
  }

  return updatedBlocks;
}

async function importArticles() {
  for (const article of articles) {
    const cover = await checkFileExistsBeforeUpload([`${article.slug}.jpg`]);
    const updatedBlocks = await updateBlocks(article.blocks);

    await createEntry({
      model: 'article',
      entry: {
        ...article,
        cover,
        blocks: updatedBlocks,
        // Make sure it's not a draft
        publishedAt: Date.now(),
      },
    });
  }
}

async function importGlobal() {
  const favicon = await checkFileExistsBeforeUpload(['favicon.png']);
  const shareImage = await checkFileExistsBeforeUpload(['default-image.png']);
  return createEntry({
    model: 'global',
    entry: {
      ...global,
      favicon,
      // Make sure it's not a draft
      publishedAt: Date.now(),
      defaultSeo: {
        ...global.defaultSeo,
        shareImage,
      },
    },
  });
}

async function importAbout() {
  const updatedBlocks = await updateBlocks(about.blocks);

  await createEntry({
    model: 'about',
    entry: {
      ...about,
      blocks: updatedBlocks,
      // Make sure it's not a draft
      publishedAt: Date.now(),
    },
  });
}

async function importCategories() {
  for (const category of categories) {
    await createEntry({ model: 'category', entry: category });
  }
}

async function importAuthors() {
  for (const author of authors) {
    const avatar = await checkFileExistsBeforeUpload([author.avatar]);

    await createEntry({
      model: 'author',
      entry: {
        ...author,
        avatar,
      },
    });
  }
}

async function importEventPages() {
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
    await createEntry({
      model: 'event-page',
      entry: {
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
        },
        publishedAt: new Date(),
      },
    });
    
    // Create corporate event page
    await createEntry({
      model: 'event-page',
      entry: {
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
        },
        publishedAt: new Date(),
      },
    });
    
    // Create birthday event page
    await createEntry({
      model: 'event-page',
      entry: {
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
        },
        publishedAt: new Date(),
      },
    });
    
    console.log('Event pages created successfully!');
    
  } catch (error) {
    console.error('Error creating event pages:', error);
    throw error;
  }
}

async function importSeedData() {
  // Allow read of application content types
  await setPublicPermissions({
    article: ['find', 'findOne'],
    category: ['find', 'findOne'],
    author: ['find', 'findOne'],
    global: ['find', 'findOne'],
    about: ['find', 'findOne'],
    'event-page': ['find', 'findOne'],
  });

  // Create all entries
  await importCategories();
  await importAuthors();
  await importArticles();
  await importGlobal();
  await importAbout();
  await importEventPages();
}

async function main() {
  const { createStrapi, compileStrapi } = require('@strapi/strapi');

  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();

  app.log.level = 'error';

  await seedExampleApp();
  await app.destroy();

  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
