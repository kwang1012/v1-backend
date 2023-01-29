const path = require('path')

module.exports = ({ env }) => ({
  connection: env("LOCAL", false)
    ? {
        client: "sqlite",
        connection: {
          filename: path.join(
            __dirname,
            "..",
            env("DATABASE_FILENAME", ".tmp/data.db")
          ),
        },
        useNullAsDefault: true,
      }
    : {
        client: "postgres",
        connection: {
          host: env("DATABASE_HOST", "127.0.0.1"),
          port: env.int("DATABASE_PORT", 5434),
          database: env("DATABASE_NAME", "kkapp"),
          user: env("DATABASE_USERNAME", "kkapp"),
          password: env("DATABASE_PASSWORD", "kkapp"),
          ssl: env.bool("DATABASE_SSL", false),
        },
      },
});
