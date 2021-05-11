module.exports = {
    type: process.env.POSTGRESQLCONNSTR_DB_TYPE,
    host: process.env.POSTGRESQLCONNSTR_DB_HOST,
    port: process.env.POSTGRESQLCONNSTR_DB_PORT,
    username: process.env.POSTGRESQLCONNSTR_DB_USERNAME,
    password: process.env.POSTGRESQLCONNSTR_DB_PASSWORD,
    database: process.env.POSTGRESQLCONNSTR_DB_NAME,
    migrations: [__dirname + '/src/migrations/*{.ts,.js}'],
    entities: [__dirname + '/src/modules/public/**/*.entity.{ts,js}'],
};