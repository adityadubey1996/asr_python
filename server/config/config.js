require('dotenv').config();  // This line loads the .env file's variables

module.exports = {
  development: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME || 'asr_python',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306
  },
  test: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || null,
    database: 'database_test',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306
  },
  production: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || null,
    database: 'database_production',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306
  }
};
