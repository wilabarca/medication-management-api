import app, { initializeRoutes } from './app';

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Inicializar rutas (esto conecta la BD y configura todo)
    await initializeRoutes();

    // Iniciar el servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`👤 Users API: http://localhost:${PORT}/users`);
      console.log(`💊 Medications API: http://localhost:${PORT}/medications`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

// Iniciar el servidor
startServer();