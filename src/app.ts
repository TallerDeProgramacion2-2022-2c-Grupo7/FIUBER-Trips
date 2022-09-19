import express from 'express';

const app = express();

app.get('/', (_req, res) => {
  res.send('Hello World Reloaded!');
});

export default app;
