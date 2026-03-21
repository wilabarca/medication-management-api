import serverless from 'serverless-http';
import app, { initializeRoutes } from '../src/app';
import { closeConnection } from '../src/Core/MySQL';

let initialized = false;
let handler: any = null;

export default async function (req: any, res: any) {
  try {
    if (!initialized) {
      await initializeRoutes();
      handler = serverless(app);
      initialized = true;
    }
    await handler(req, res);
  } catch (error) {
    console.error('❌ Error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } finally {
    await closeConnection();
    initialized = false;
  }
}