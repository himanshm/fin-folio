export default {
    postgres: {
      host: process.env.PG_HOST,
      port: parseInt(process.env.PG_PORT || '5432'),
      username: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DB
    }
};
  