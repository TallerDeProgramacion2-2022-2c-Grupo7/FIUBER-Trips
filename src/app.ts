/* eslint-disable @typescript-eslint/no-unused-vars */
import express from 'express';

import apiRouter from './router';

const app = express();

app.use(express.json());

app.use('/api', apiRouter);

app.get('/', (_req, res) => {
  res.status(200).send('ping!');
});

export default app;
