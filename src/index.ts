import app from './app';
import DB from './db';

DB.createConnection().then(() => {
  const port = 8000;

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
});
