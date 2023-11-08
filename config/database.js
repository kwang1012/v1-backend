const path = require('path')

module.exports = ({ env }) => ({
    connection: {
        client: "mysql",
        connection: {
            host: env("DATABASE_HOST", "127.0.0.1"),
            port: env.int("DATABASE_PORT", 3306),
            database: env("DATABASE_NAME", "kkapp"),
            user: env("DATABASE_USERNAME", "kkapp"),
            password: env("DATABASE_PASSWORD", "kkapp"),
            ssl: env.bool("DATABASE_SSL", false),
        },
    },
});
