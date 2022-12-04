import { Router } from 'express';
import firebaseAuth from '../middlewares/auth';
import datadogEvent from '../middlewares/datadogEvent';

import tripRouter from './trips';
import costRouter from './costs';
import rulesRouter from './rules';

const apiRouter = Router();

apiRouter.use('/trips', firebaseAuth, tripRouter);
apiRouter.use('/costs', firebaseAuth, costRouter);
apiRouter.use('/rules', datadogEvent, firebaseAuth, rulesRouter);

export default apiRouter;
