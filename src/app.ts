/* eslint-disable @typescript-eslint/no-unused-vars */
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import apiRouter from './router';

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use('/api', apiRouter);

app.get('/', (_req, res) => {
  res.status(200).send('ping!');
});

export default app;
