import serverless from 'serverless-http';
import app, { initializeRoutes } from '../src/app';

let handler: any = null;

// Inicializar inmediatamente cuando la función se carga
const initPromise = initializeRoutes()
  .then(() => {
    console.log('✅ Inicialización completada, creando handler...');
    handler = serverless(app);
    console.log('✅ Handler creado exitosamente');
  })
  .catch(error => {
    console.error('❌ Error en inicialización:', error);
    // Incluso si hay error, crear handler para que al menos /test funcione
    handler = serverless(app);
    console.log('⚠️ Handler creado con errores, solo rutas básicas disponibles');
  });

export default async function (req: any, res: any) {
  console.log(`📥 Request: ${req.method} ${req.url}`);
  
  try {
    // Esperar a que la inicialización termine (o falle)
    await initPromise;
    
    // Ejecutar handler
    return await handler(req, res);
    
  } catch (error) {
    console.error('❌ Error en handler:', error);
    
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
        url: req.url,
        method: req.method
      });
    }
  }
}