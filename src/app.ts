import express from 'express';

import apiRouter from './router';

const app = express();

app.use('/api', apiRouter);

export default app;
