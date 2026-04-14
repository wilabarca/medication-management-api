import app, { initializeRoutes } from './app';
import { closeConnection } from './Core/MySQL';

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    console.log('🚀 Iniciando servidor...');
    await initializeRoutes();

    const server = app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
    });

    const gracefulShutdown = async () => {
      console.log('🛑 Recibida señal de cierre, cerrando servidor...');
      server.close(async () => {
        console.log('✅ Servidor HTTP cerrado');
        await closeConnection();
        console.log('✅ Conexión MySQL cerrada');
        process.exit(0);
      });
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);

  } catch (error) {
    console.error('❌ Error iniciando servidor:', error);
    process.exit(1);
  }
}

startServer();