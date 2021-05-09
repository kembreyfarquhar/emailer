require("dotenv").config();

module.exports = {
  development: {
    client: "pg",
    useNullAsDefault: true,
    pool: {
      min: 2,
      max: 100,
      createTimeoutMillis: 3000,
      acquireTimeoutMillis: 3000,
      idleTimeoutMillis: 3000,
      reapIntervalMillis: 3000,
      createRetryIntervalMillis: 3000,
    },
    connection: {
      database: process.env.DB_DEV_DATABASE,
      user: process.env.DB_DEV_USER,
      password: process.env.DB_DEV_PASSWORD,
    },
    migrations: {
      directory: "./db/migrations",
    },
    seeds: {
      directory: "./db/seeds",
    },
  },

  production: {
    client: "pg",
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    },
    pool: {
      min: 2,
      max: 100,
    },
    ssl: true,
    useNullAsDefault: true,
    migrations: {
      tableName: "knex_migrations",
      directory: "./db/migrations",
    },
  },
};
