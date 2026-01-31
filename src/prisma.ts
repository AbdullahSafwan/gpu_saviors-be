import { PrismaClient } from '../generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import 'dotenv/config';

const createAdapter = () => {
  return new PrismaMariaDb({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    port: Number(process.env.DATABASE_PORT) || 3306,
    connectionLimit: 10,
    allowPublicKeyRetrieval: true,
    connectTimeout: 30000,
    acquireTimeout: 30000,
    idleTimeout: 600000,
  });
};

const prisma = new PrismaClient({
  adapter: createAdapter(),
  log: process.env.NODE_ENV === 'development'
    ? ['query', 'error', 'warn']
    : ['error'],
});

export default prisma;
