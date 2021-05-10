// const dotenv = require('dotenv');

// dotenv.config();

// const {
//     DB_TYPE,
//     DB_HOST,
//     DB_USERNAME,
//     DB_PASSWORD,
//     DB_PORT,
//     DB_DATABASE,
// } = process.env;

module.exports = {
    type: process.env.POSTGRESQL_DB_TYPE,
    host: process.env.POSTGRESQL_DB_HOST,
    port: process.env.POSTGRESQL_DB_PORT,
    username: process.env.POSTGRESQL_DB_USERNAME,
    password: process.env.POSTGRESQL_DB_PASSWORD,
    database: process.env.POSTGRESQL_DB_NAME,
    migrations: [__dirname + '/src/migrations/*{.ts,.js}'],
    entities: [__dirname + '/src/modules/public/**/*.entity.{ts,js}'],
};