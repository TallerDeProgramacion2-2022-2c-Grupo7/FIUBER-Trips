import { Router } from 'express';
import { getTrips } from '../controllers';

const tripRouter = Router();

tripRouter.get('/', getTrips);

export default tripRouter;
