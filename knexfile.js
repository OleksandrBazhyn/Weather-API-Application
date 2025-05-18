import 'dotenv/config';

console.log('DATABASE_URL:', process.env.DATABASE_URL);

export default {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './migrations',
    },
  },
};
