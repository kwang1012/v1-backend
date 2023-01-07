module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1338),
  url: env('SERVER_URL', 'localhost'),
  app: {
    keys: env.array('APP_KEYS'),
  },
});
