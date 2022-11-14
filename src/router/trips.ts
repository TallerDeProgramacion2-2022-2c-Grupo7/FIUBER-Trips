import { Router } from 'express';
import { TripController } from '../controllers';

const tripRouter = Router();

tripRouter.get('/', TripController.getTrips);
tripRouter.get('/available', TripController.getAvailableTrip);
tripRouter.get('/metrics', TripController.getMetricsForUser);
tripRouter.get('/:id', TripController.getTrip);
tripRouter.post('/', TripController.newTrip);
tripRouter.post('/:id/reject', TripController.rejectTrip);
tripRouter.post('/:id/accept', TripController.acceptTrip);
tripRouter.post('/:id/start', TripController.startTrip);
tripRouter.post('/:id/finish', TripController.finishTrip);

export default tripRouter;
