import serverless from 'serverless-http';
import app, { initializeRoutes } from '../src/app';

let handler: any = null;

export default async function (req: any, res: any) {
  try {
    // Inicializar solo una vez
    if (!handler) {
      console.log('🔄 Inicializando aplicación...');
      await initializeRoutes();
      handler = serverless(app);
      console.log('✅ Aplicación inicializada');
    }
    
    return await handler(req, res);
    
  } catch (error) {
    console.error('❌ Error fatal:', error);
    
    // Resetear handler para reintentar
    handler = null;
    
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}