/**
 * Admin app configuration
 */

export default {
  config: {
    // Replace the favicon
    head: {
      favicon: '/favicon.ico',
    },
    // Add a custom logo
    auth: {
      logo: '/logo.png',
    },
    // Override or extend the theme
    theme: {
      light: {
        colors: {
          primary100: '#f6ecfc',
          primary200: '#e0c1f4',
          primary500: '#ac73e6',
          primary600: '#9736e8',
          primary700: '#8312d1',
          danger700: '#b72b1a',
          success600: '#328048',
          warning600: '#d02b20',
        },
      },
    },
    // Extend the translations
    translations: {
      en: {
        'app.components.LeftMenu.navbrand.title': 'Hi-Catering Admin',
        'app.components.LeftMenu.navbrand.workplace': 'Orders Management',
      },
      ru: {
        'app.components.LeftMenu.navbrand.title': 'Hi-Catering Админ',
        'app.components.LeftMenu.navbrand.workplace': 'Управление заказами',
        'content-manager.containers.ListPage.displayedFields': 'Отображаемые поля',
        'content-manager.containers.Edit.pluginHeader.title.new': 'Создать новую запись',
        'content-manager.containers.Edit.pluginHeader.title.edit': 'Редактировать запись',
        'content-manager.containers.Edit.pluginHeader.title.duplicate': 'Дублировать запись',
        'content-manager.containers.Edit.pluginHeader.title.delete': 'Удалить запись',
        'content-manager.containers.Edit.pluginHeader.title.deleteAll': 'Удалить все записи',
        'content-manager.containers.Edit.pluginHeader.title.publish': 'Опубликовать',
        'content-manager.containers.Edit.pluginHeader.title.unpublish': 'Снять с публикации',
        'content-manager.containers.Edit.pluginHeader.title.save': 'Сохранить',
        'content-manager.containers.Edit.pluginHeader.title.saveAndPublish': 'Сохранить и опубликовать',
        'content-manager.containers.Edit.pluginHeader.title.saveAndUnpublish': 'Сохранить и снять с публикации',
        'content-manager.containers.Edit.pluginHeader.title.saveAndContinue': 'Сохранить и продолжить',
        'content-manager.containers.Edit.pluginHeader.title.saveAndDuplicate': 'Сохранить и дублировать',
        'content-manager.containers.Edit.pluginHeader.title.saveAndNew': 'Сохранить и создать новую',
        'content-manager.containers.Edit.pluginHeader.title.saveAndClose': 'Сохранить и закрыть',
        'content-manager.containers.Edit.pluginHeader.title.saveAndView': 'Сохранить и просмотреть',
        'content-manager.containers.Edit.pluginHeader.title.saveAndEdit': 'Сохранить и редактировать',
        'content-manager.containers.Edit.pluginHeader.title.saveAndList': 'Сохранить и перейти к списку',
        'content-manager.containers.Edit.pluginHeader.title.saveAndSearch': 'Сохранить и найти',
        'content-manager.containers.Edit.pluginHeader.title.saveAndFilter': 'Сохранить и фильтровать',
        'content-manager.containers.Edit.pluginHeader.title.saveAndSort': 'Сохранить и сортировать',
        'content-manager.containers.Edit.pluginHeader.title.saveAndGroup': 'Сохранить и группировать',
        'content-manager.containers.Edit.pluginHeader.title.saveAndExport': 'Сохранить и экспортировать',
        'content-manager.containers.Edit.pluginHeader.title.saveAndImport': 'Сохранить и импортировать',
        'content-manager.containers.Edit.pluginHeader.title.saveAndBackup': 'Сохранить и создать резервную копию',
        'content-manager.containers.Edit.pluginHeader.title.saveAndRestore': 'Сохранить и восстановить',
        'content-manager.containers.Edit.pluginHeader.title.saveAndArchive': 'Сохранить и архивировать',
        'content-manager.containers.Edit.pluginHeader.title.saveAndUnarchive': 'Сохранить и разархивировать',
        'content-manager.containers.Edit.pluginHeader.title.saveAndMove': 'Сохранить и переместить',
        'content-manager.containers.Edit.pluginHeader.title.saveAndCopy': 'Сохранить и скопировать',
        'content-manager.containers.Edit.pluginHeader.title.saveAndMoveToTrash': 'Сохранить и переместить в корзину',
        'content-manager.containers.Edit.pluginHeader.title.saveAndRestoreFromTrash': 'Сохранить и восстановить из корзины',
        'content-manager.containers.Edit.pluginHeader.title.saveAndEmptyTrash': 'Сохранить и очистить корзину',
        'content-manager.containers.Edit.pluginHeader.title.saveAndPermanentlyDelete': 'Сохранить и удалить навсегда',
        'content-manager.containers.Edit.pluginHeader.title.saveAndSoftDelete': 'Сохранить и мягко удалить',
        'content-manager.containers.Edit.pluginHeader.title.saveAndHardDelete': 'Сохранить и жестко удалить',
        'content-manager.containers.Edit.pluginHeader.title.saveAndBulkDelete': 'Сохранить и массово удалить',
        'content-manager.containers.Edit.pluginHeader.title.saveAndBulkEdit': 'Сохранить и массово редактировать',
        'content-manager.containers.Edit.pluginHeader.title.saveAndBulkPublish': 'Сохранить и массово опубликовать',
        'content-manager.containers.Edit.pluginHeader.title.saveAndBulkUnpublish': 'Сохранить и массово снять с публикации',
        'content-manager.containers.Edit.pluginHeader.title.saveAndBulkDuplicate': 'Сохранить и массово дублировать',
        'content-manager.containers.Edit.pluginHeader.title.saveAndBulkMove': 'Сохранить и массово переместить',
        'content-manager.containers.Edit.pluginHeader.title.saveAndBulkCopy': 'Сохранить и массово скопировать',
        'content-manager.containers.Edit.pluginHeader.title.saveAndBulkExport': 'Сохранить и массово экспортировать',
        'content-manager.containers.Edit.pluginHeader.title.saveAndBulkImport': 'Сохранить и массово импортировать',
        'content-manager.containers.Edit.pluginHeader.title.saveAndBulkBackup': 'Сохранить и массово создать резервную копию',
        'content-manager.containers.Edit.pluginHeader.title.saveAndBulkRestore': 'Сохранить и массово восстановить',
        'content-manager.containers.Edit.pluginHeader.title.saveAndBulkArchive': 'Сохранить и массово архивировать',
        'content-manager.containers.Edit.pluginHeader.title.saveAndBulkUnarchive': 'Сохранить и массово разархивировать',
        'content-manager.containers.Edit.pluginHeader.title.saveAndBulkMoveToTrash': 'Сохранить и массово переместить в корзину',
        'content-manager.containers.Edit.pluginHeader.title.saveAndBulkRestoreFromTrash': 'Сохранить и массово восстановить из корзины',
        'content-manager.containers.Edit.pluginHeader.title.saveAndBulkEmptyTrash': 'Сохранить и массово очистить корзину',
        'content-manager.containers.Edit.pluginHeader.title.saveAndBulkPermanentlyDelete': 'Сохранить и массово удалить навсегда',
        'content-manager.containers.Edit.pluginHeader.title.saveAndBulkSoftDelete': 'Сохранить и массово мягко удалить',
        'content-manager.containers.Edit.pluginHeader.title.saveAndBulkHardDelete': 'Сохранить и массово жестко удалить',
      },
    },
    // Disable video tutorials
    tutorials: false,
    // Disable notifications about new Strapi releases
    notifications: { releases: false },
  },
  bootstrap() {
    console.log('Hi-Catering Admin Panel loaded');
  },
};