import app, { initializeRoutes } from './app';

const PORT = process.env.PORT || 3000;

async function startServer() {
  await initializeRoutes();


  app.listen(PORT, () => {
    console.log(`🚀 http://0.0.0.0:${PORT}`);
  });
}

startServer();
