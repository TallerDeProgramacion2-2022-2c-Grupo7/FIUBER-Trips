import { Request, Response } from 'express';
import { ENDPOINT_ERRORS } from '../constants/errors';
import Trip, { TripStatus } from '../db/trips';
import { AuthenticatedRequest } from '../middlewares/auth';
import { calculateCost } from '../utils/costs';
import {
  checkForAcceptStatus,
  checkForFinishStatus,
  checkForStartStatus,
} from '../utils/next-status';

export const getTrips = async (_req: Request, res: Response) => {
  const trips = await Trip.find().limit(10);
  res.status(200).json({ result: trips.map(trip => trip.toJSON()) });
};

export const getTrip = async (req: Request, res: Response) => {
  const tripId = req.params.id;
  const trip = await Trip.findById(tripId);
  res.status(200).json({ result: trip?.toJSON() });
};

export const newTrip = async (req: AuthenticatedRequest, res: Response) => {
  const bodyData = req.body;
  const { user } = req;
  const trip = {
    ...bodyData,
    userId: user?.uid,
    createdAt: new Date(),
    status: TripStatus.SERCHING_DRIVER,
    cost: calculateCost(bodyData.from, bodyData.to),
  };
  const tripRecord = new Trip(trip);
  await tripRecord.save();
  res.status(201).json({ result: tripRecord.toJSON() });
};

export const getAvailableTrip = async (
  _req: AuthenticatedRequest,
  res: Response
) => {
  const trip = await Trip.findOneAndUpdate(
    {
      status: { $eq: TripStatus.SERCHING_DRIVER },
    },
    { status: TripStatus.WAITING_DRIVER },
    { new: true }
  );
  if (!trip) {
    return res.status(200).json({ result: null });
  }
  return res.status(200).json({ result: trip.toJSON() });
};

export const acceptTrip = async (req: AuthenticatedRequest, res: Response) => {
  const tripId = req.params.id;
  const { user } = req;
  const trip = await Trip.findById(tripId);
  if (!trip) {
    return res.status(404).json({ error: ENDPOINT_ERRORS.tripNotFound });
  }
  const { error } = checkForAcceptStatus(trip);
  if (error) {
    return res.status(400).json({ error });
  }
  const updatedTrip = await Trip.findByIdAndUpdate(
    trip.id,
    {
      driverId: user?.uid,
      status: TripStatus.ACCEPTED,
    },
    { new: true }
  );
  return res.status(200).json({ result: updatedTrip!.toJSON() });
};

export const reject = async (req: AuthenticatedRequest, res: Response) => {
  const tripId = req.params.id;
  const trip = await Trip.findById(tripId);
  if (!trip) {
    return res.status(404).json({ error: ENDPOINT_ERRORS.tripNotFound });
  }
  const { error } = checkForAcceptStatus(trip);
  if (error) {
    return res.status(400).json({ error });
  }
  const updatedTrip = await Trip.findByIdAndUpdate(
    trip.id,
    {
      status: TripStatus.SERCHING_DRIVER,
    },
    { new: true }
  );
  return res.status(200).json({ result: updatedTrip!.toJSON() });
};

export const startTrip = async (req: AuthenticatedRequest, res: Response) => {
  const tripId = req.params.id;
  const trip = await Trip.findById(tripId);
  if (!trip) {
    return res.status(404).json({ error: ENDPOINT_ERRORS.tripNotFound });
  }
  const { error } = checkForStartStatus(trip);
  if (error) {
    return res.status(400).json({ error });
  }
  const updatedTrip = await Trip.findByIdAndUpdate(
    trip.id,
    {
      status: TripStatus.STARTED,
    },
    { new: true }
  );
  return res.status(200).json({ result: updatedTrip!.toJSON() });
};

export const finishTrip = async (req: AuthenticatedRequest, res: Response) => {
  const tripId = req.params.id;
  const trip = await Trip.findById(tripId);
  if (!trip) {
    return res.status(404).json({ error: ENDPOINT_ERRORS.tripNotFound });
  }
  const { error } = checkForFinishStatus(trip);
  if (error) {
    return res.status(400).json({ error });
  }
  const updatedTrip = await Trip.findByIdAndUpdate(
    trip.id,
    {
      status: TripStatus.FINISHED,
    },
    { new: true }
  );
  return res.status(200).json({ result: updatedTrip!.toJSON() });
};
