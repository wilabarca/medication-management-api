import serverless from 'serverless-http';
import app, { initializeRoutes } from '../src/app';
import { closePool, checkHealth } from '../src/Core/MySQL';

let initialized = false;
let serverlessHandler: any = null;

// Limpiar conexiones cuando la función se descargue
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM recibido, cerrando conexiones...');
  await closePool();
  process.exit(0);
});

// Función para manejar reintentos
async function initializeWithRetry(retries = 3, delay = 1000): Promise<void> {
  for (let i = 0; i < retries; i++) {
    try {
      await initializeRoutes();
      return;
    } catch (error) {
      console.error(`Intento ${i + 1} falló:`, error);
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

export default async (req: any, res: any) => {
  const startTime = Date.now();
  console.log(`📥 Request recibida: ${req.method} ${req.url}`);

  try {
    if (!initialized) {
      console.log('🔄 Inicializando por primera vez...');
      await initializeWithRetry();
      initialized = true;
      serverlessHandler = serverless(app);
      console.log('✅ Handler creado correctamente');
    }

    // Verificar salud antes de procesar
    const isDbHealthy = await checkHealth();
    if (!isDbHealthy) {
      console.log('⚠️ DB no saludable, reinicializando...');
      initialized = false;
      await initializeWithRetry();
      initialized = true;
    }

    const result = await serverlessHandler(req, res);
    const duration = Date.now() - startTime;
    console.log(`📤 Request completada en ${duration}ms`);
    return result;
    
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ Error en handler después de ${duration}ms:`, error);
    
    // Si hay error, intentar limpiar el estado
    initialized = false;
    serverlessHandler = null;
    
    // Intentar cerrar el pool
    await closePool().catch(console.error);
    
    // Enviar respuesta de error
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  }
};