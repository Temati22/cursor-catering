export default ({ env }) => ({
  host: env('HOST', 'localhost'), // localhost для локальной разработки
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
});
