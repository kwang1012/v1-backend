module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1338),
  url: 'https://admin.kwang.cc',
  app: {
    keys: env.array('APP_KEYS'),
  },
});
