export default {
  upload: {
    config: {
      provider: 'local',
      sizeLimit: 250 * 1024 * 1024, // 256mb in bytes
      breakpoints: {
        xlarge: 1920,
        large: 1000,
        medium: 750,
        small: 500,
        xsmall: 64
      },
    },
  },
  documentation: {
    config: {
      openapi: '3.0.0',
      info: {
        version: '1.0.0',
        title: 'Modern SEO Marketing Site API',
        description: 'API для управления контентом сайта',
        termsOfService: 'https://example.com/terms',
        contact: {
          name: 'API Support',
          email: 'api@example.com',
          url: 'https://example.com/contact',
        },
        license: {
          name: 'MIT',
          url: 'https://opensource.org/licenses/MIT',
        },
      },
      servers: [
        {
          url: process.env.PUBLIC_URL || 'http://localhost:1337',
          description: 'Development server',
        },
      ],
      externalDocs: {
        description: 'Find out more',
        url: 'https://docs.strapi.io/developer-docs/latest/getting-started/introduction.html',
      },
    },
  },
  graphql: {
    config: {
      endpoint: '/graphql',
      shadowCRUD: true,
      playgroundAlways: false,
      depthLimit: 7,
      amountLimit: 100,
      apolloServer: {
        tracing: false,
      },
    },
  },
  i18n: {
    enabled: true,
    config: {
      defaultLocale: 'ru',
      locales: ['ru', 'en'],
    },
  },
};
