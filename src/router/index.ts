import { Router } from 'express';
import firebaseAuth from '../middlewares/auth';

import tripRouter from './trips';

const apiRouter = Router();

apiRouter.use('/trips', firebaseAuth, tripRouter);

export default apiRouter;
