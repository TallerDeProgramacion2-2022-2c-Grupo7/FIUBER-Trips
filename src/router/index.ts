import { Router } from 'express';
import firebaseAuth from '../middlewares/auth';

import tripRouter from './trips';
import costRouter from './costs';

const apiRouter = Router();

apiRouter.use('/trips', firebaseAuth, tripRouter);
apiRouter.use('/costs', firebaseAuth, costRouter);

export default apiRouter;
