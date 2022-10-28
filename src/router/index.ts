import { Router } from 'express';
import firebaseAuth from '../middlewares/auth';

import tripRouter from './trips';
import costRouter from './costs';
import rulesRouter from './rules';

const apiRouter = Router();

apiRouter.use('/trips', firebaseAuth, tripRouter);
apiRouter.use('/costs', firebaseAuth, costRouter);
apiRouter.use('/rules', firebaseAuth, rulesRouter);

export default apiRouter;
