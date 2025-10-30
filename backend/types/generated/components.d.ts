import type { Schema, Struct } from '@strapi/strapi';

export interface ContactsContacts extends Struct.ComponentSchema {
  collectionName: 'components_contacts_contacts';
  info: {
    displayName: 'Contacts';
    icon: 'alien';
  };
  attributes: {
    address: Schema.Attribute.String;
    email: Schema.Attribute.Email;
    phone1: Schema.Attribute.String;
    phone2: Schema.Attribute.String;
  };
}

export interface OrderOrderItem extends Struct.ComponentSchema {
  collectionName: 'components_order_order_items';
  info: {
    description: 'Individual menu item in an order';
    displayName: 'Order Item';
  };
  attributes: {
    menu: Schema.Attribute.Relation<'oneToOne', 'api::menu.menu'>;
    quantity: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    totalPrice: Schema.Attribute.Decimal & Schema.Attribute.Required;
    unitPrice: Schema.Attribute.Decimal & Schema.Attribute.Required;
  };
}

export interface SharedContactInfo extends Struct.ComponentSchema {
  collectionName: 'components_shared_contact_info';
  info: {
    description: 'Contact information including phones, email and address';
    displayName: 'Contact Info';
  };
  attributes: {
    address: Schema.Attribute.Text;
    email: Schema.Attribute.Email;
    phone1: Schema.Attribute.String;
    phone2: Schema.Attribute.String;
  };
}

export interface SharedGalereyaDlyaMeropriyatiya
  extends Struct.ComponentSchema {
  collectionName: 'components_shared_galereya_dlya_meropriyatiya';
  info: {
    displayName: '\u0413\u0430\u043B\u0435\u0440\u0435\u044F \u0434\u043B\u044F \u043C\u0435\u0440\u043E\u043F\u0440\u0438\u044F\u0442\u0438\u044F';
    icon: 'landscape';
  };
  attributes: {
    backgroundImg: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    Images: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    Title: Schema.Attribute.String;
  };
}

export interface SharedMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_media';
  info: {
    displayName: 'Media';
    icon: 'file-video';
  };
  attributes: {
    file: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
  };
}

export interface SharedMenusInEvents extends Struct.ComponentSchema {
  collectionName: 'components_shared_menus_in_events';
  info: {
    displayName: 'MenusInEvents';
    icon: 'layer';
  };
  attributes: {
    menus: Schema.Attribute.Relation<'oneToMany', 'api::menu.menu'>;
  };
}

export interface SharedQuote extends Struct.ComponentSchema {
  collectionName: 'components_shared_quotes';
  info: {
    displayName: 'Quote';
    icon: 'indent';
  };
  attributes: {
    body: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedRichText extends Struct.ComponentSchema {
  collectionName: 'components_shared_rich_texts';
  info: {
    description: '';
    displayName: 'Rich text';
    icon: 'align-justify';
  };
  attributes: {
    body: Schema.Attribute.RichText;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'Seo';
    icon: 'allergies';
    name: 'Seo';
  };
  attributes: {
    metaCanonical: Schema.Attribute.String;
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaKeywords: Schema.Attribute.String;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
    shareImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedSeoMenuWrapper extends Struct.ComponentSchema {
  collectionName: 'components_shared_seo_menu_wrappers';
  info: {
    displayName: 'SeoMenuWrapper';
    icon: 'hashtag';
  };
  attributes: {
    Description: Schema.Attribute.RichText;
    SubTitle: Schema.Attribute.String;
    Title: Schema.Attribute.String;
  };
}

export interface SharedSlider extends Struct.ComponentSchema {
  collectionName: 'components_shared_sliders';
  info: {
    description: '';
    displayName: 'Slider';
    icon: 'address-book';
  };
  attributes: {
    files: Schema.Attribute.Media<'images', true>;
  };
}

export interface SharedSocialLinks extends Struct.ComponentSchema {
  collectionName: 'components_shared_social_links';
  info: {
    description: 'Social media links and contact information';
    displayName: 'Social Links';
  };
  attributes: {
    instagram: Schema.Attribute.String;
    telegram: Schema.Attribute.String;
    vk: Schema.Attribute.String;
    whatsapp: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'contacts.contacts': ContactsContacts;
      'order.order-item': OrderOrderItem;
      'shared.contact-info': SharedContactInfo;
      'shared.galereya-dlya-meropriyatiya': SharedGalereyaDlyaMeropriyatiya;
      'shared.media': SharedMedia;
      'shared.menus-in-events': SharedMenusInEvents;
      'shared.quote': SharedQuote;
      'shared.rich-text': SharedRichText;
      'shared.seo': SharedSeo;
      'shared.seo-menu-wrapper': SharedSeoMenuWrapper;
      'shared.slider': SharedSlider;
      'shared.social-links': SharedSocialLinks;
    }
  }
}
