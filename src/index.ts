import express from 'express';
import type { Express } from 'express';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

import { PORT } from './secrets.ts';
import rootRouter from './routes/index.ts';

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Simple health endpoint so / returns 200
// app.get('/', (_req, res) => {
//   res.send('API is up');
// });

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set in .env');
}

const pool = new Pool({ connectionString: databaseUrl });
const adapter = new PrismaPg(pool);

export const prismaClient = new PrismaClient({
  adapter,
  log: ['query'],
});

app.use('/', rootRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});