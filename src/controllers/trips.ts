import { Request, Response } from 'express';
import { ENDPOINT_ERRORS } from '../constants/errors';
import Trip, {
  acceptTripAndUpdate,
  cancelTripAndUpdate,
  createAndSaveTrip,
  finishTripAndUpdate,
  getOneAvailableTrip,
  getUnfinishedTrip,
  rejectTripAndUpdate,
  startTripAndUpdate,
  updatePaymentHash,
} from '../db/trips';
import { TripStatus } from '../interfaces/trip';
import Rules from '../db/rules';
import { AuthenticatedRequest } from '../middlewares/auth';
import { calculateCost, calculateDuration } from '../utils/costs';
import { executePayment } from '../services/wallet';
import {
  sendNewTripNotification,
  sendTripAcceptedNotification,
} from '../services/notification';

export const getTrips = async (_req: Request, res: Response) => {
  const trips = await Trip.find().limit(10);
  res.status(200).json({ result: trips.map(trip => trip.toJSON()) });
};

export const getTrip = async (req: Request, res: Response) => {
  const tripId = req.params.id;
  const trip = await Trip.findById(tripId);
  res.status(200).json({ result: trip?.toJSON() });
};

export const getMetricsForUser = async (req: Request, res: Response) => {
  const { uid } = req.query;
  const tripsAsPassenger = await Trip.find({ passengerId: uid }).count();
  const tripsAsDriver = await Trip.find({ driverId: uid }).count();
  res.status(200).json({ result: { tripsAsPassenger, tripsAsDriver } });
};

export const newTrip = async (req: AuthenticatedRequest, res: Response) => {
  const bodyData = req.body;
  const { user } = req;
  const trip = {
    ...bodyData,
    passengerId: user?.uid,
    createdAt: new Date(),
    status: TripStatus.SERCHING_DRIVER,
    canceledDriver: [],
  };

  const rules = await Rules.findOne().sort({ _id: -1 });
  const cost = calculateCost(trip, rules!);
  const duration = calculateDuration(trip);
  const tripRecord = await createAndSaveTrip({ ...trip, cost, duration });

  await sendNewTripNotification();

  res.status(201).json({ result: tripRecord.toJSON() });
};

export const getAvailableTrip = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { user } = req;

  const trip = await getOneAvailableTrip(user!.uid);
  if (!trip) {
    return res.status(200).json({ result: null });
  }

  return res.status(200).json({ result: trip.toJSON() });
};

export const acceptTrip = async (req: AuthenticatedRequest, res: Response) => {
  const tripId = req.params.id;
  const { user } = req;

  try {
    const updatedTrip = await acceptTripAndUpdate(tripId, user!.uid);

    await sendTripAcceptedNotification(updatedTrip!.passengerDeviceId);

    return res.status(200).json({ result: updatedTrip!.toJSON() });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const rejectTrip = async (req: AuthenticatedRequest, res: Response) => {
  const tripId = req.params.id;
  const { user } = req;

  try {
    const updatedTrip = await rejectTripAndUpdate(tripId, user!.uid);

    return res.status(200).json({ result: updatedTrip!.toJSON() });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const startTrip = async (req: AuthenticatedRequest, res: Response) => {
  const tripId = req.params.id;

  try {
    const updatedTrip = await startTripAndUpdate(tripId);

    return res.status(200).json({ result: updatedTrip!.toJSON() });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const finishTrip = async (req: AuthenticatedRequest, res: Response) => {
  const tripId = req.params.id;
  const { user } = req;

  try {
    const updatedTrip = await finishTripAndUpdate(tripId, user!.uid);
    const tx = await executePayment(
      updatedTrip.passengerId,
      updatedTrip.driverId,
      updatedTrip.cost
    );
    if (!tx) {
      return res.status(500).json({ error: ENDPOINT_ERRORS.paymentError });
    }

    const tripWithPayment = await updatePaymentHash(tripId, tx.hash);

    return res.status(200).json({ result: tripWithPayment.toJSON() });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const cancelTrip = async (req: AuthenticatedRequest, res: Response) => {
  const tripId = req.params.id;
  const { user } = req;

  try {
    const updatedTrip = await cancelTripAndUpdate(tripId, user!.uid);

    return res.status(200).json({ result: updatedTrip!.toJSON() });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const unfinishedTrip = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { user } = req;

  try {
    const trip = await getUnfinishedTrip(user!.uid);

    if (!trip) {
      return res.status(200).json({ result: null });
    }

    return res.status(200).json({ result: trip.toJSON() });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
