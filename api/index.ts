import serverless from 'serverless-http';
import app, { initializeRoutes } from '../src/app';
import { pool } from '../src/Core/MySQL';

let initialized = false;
const handler = serverless(app);

export default async (req: any, res: any) => {
  if (!initialized) {
    await initializeRoutes();
    initialized = true;
  }

  const result = await handler(req, res);

  await pool.end().catch(() => {});
  initialized = false;

  return result;
};