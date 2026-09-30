import express from 'express';
import healthRouter from './routes/health.js';
import reportRouter from './routes/reports.js';

function createApp() {
  const app = express();
  app.use(healthRouter);
  app.use(reportRouter);
  return app;
}

export default createApp();