import { Schema, model } from 'mongoose';
import { ENDPOINT_ERRORS } from '../constants/errors';
import { ILatLng, IMapPoint, ITrip, TripStatus } from '../interfaces/trip';
import { isDriver, isPassanger } from '../validations/attributes';
import {
  checkForAcceptStatus,
  checkForCanceledStatus,
  checkForFinishStatus,
  checkForStartStatus,
} from '../validations/next-status';

export const LatLongSchema = new Schema<ILatLng>(
  {
    latitude: Number,
    longitude: Number,
  },
  { _id: false }
);

const MapPointSchema = new Schema<IMapPoint>(
  {
    coordinates: LatLongSchema,
    description: Object,
  },
  { _id: false }
);

const TripSchema = new Schema<ITrip>({
  passengerId: String,
  passengerDeviceId: String,
  driverId: String,
  from: MapPointSchema,
  to: MapPointSchema,
  cost: Number,
  status: {
    type: String,
    enum: Object.values(TripStatus),
  },
  paymentHash: String,
  canceledDriver: [String],
  createdAt: Date,
});

const Trip = model<ITrip>('Trip', TripSchema);

export const createAndSaveTrip = (trip: ITrip) => new Trip(trip).save();

export const getOneAvailableTrip = async (driverId: string) =>
  Trip.findOneAndUpdate(
    {
      status: { $eq: TripStatus.SERCHING_DRIVER },
      canceledDriver: { $ne: driverId },
    },
    { status: TripStatus.WAITING_DRIVER },
    { new: true }
  );

export const acceptTripAndUpdate = async (tripId: string, driverId: string) => {
  const trip = await Trip.findById(tripId);
  if (!trip) {
    throw new Error(ENDPOINT_ERRORS.tripNotFound);
  }
  const { error } = checkForAcceptStatus(trip);
  if (error) {
    throw new Error(error);
  }

  return Trip.findByIdAndUpdate(
    trip.id,
    {
      driverId,
      status: TripStatus.ACCEPTED,
    },
    { new: true }
  );
};

export const rejectTripAndUpdate = async (tripId: string, driverId: string) => {
  const trip = await Trip.findById(tripId);
  if (!trip) {
    throw new Error(ENDPOINT_ERRORS.tripNotFound);
  }
  const { error } = checkForAcceptStatus(trip);
  if (error) {
    throw new Error(error);
  }

  const updatedCanceledDriver = [...trip.canceledDriver.slice(0, 4), driverId];

  return Trip.findByIdAndUpdate(
    trip.id,
    {
      status: TripStatus.SERCHING_DRIVER,
      canceledDriver: updatedCanceledDriver,
    },
    { new: true }
  );
};

export const startTripAndUpdate = async (tripId: string) => {
  const trip = await Trip.findById(tripId);

  if (!trip) {
    throw new Error(ENDPOINT_ERRORS.tripNotFound);
  }
  const { error } = checkForStartStatus(trip);
  if (error) {
    throw new Error(error);
  }
  return Trip.findByIdAndUpdate(
    trip.id,
    {
      status: TripStatus.STARTED,
    },
    { new: true }
  );
};

export const finishTripAndUpdate = async (tripId: string, driverId: string) => {
  const trip = await Trip.findById(tripId);
  if (!trip) {
    throw new Error(ENDPOINT_ERRORS.tripNotFound);
  }
  const { error } = checkForFinishStatus(trip);
  if (error) {
    throw new Error(error);
  }

  const { error: attrError } = isDriver(trip, driverId);
  if (attrError) {
    throw new Error(attrError);
  }

  const updatedTrip = await Trip.findByIdAndUpdate(
    trip.id,
    {
      status: TripStatus.FINISHED,
    },
    { new: true }
  );

  if (!updatedTrip || updatedTrip === null) {
    throw new Error(ENDPOINT_ERRORS.tripNotFound);
  }

  return updatedTrip;
};

export const cancelTripAndUpdate = async (
  tripId: string,
  passangerId: string
) => {
  const trip = await Trip.findById(tripId);
  if (!trip) {
    throw new Error(ENDPOINT_ERRORS.tripNotFound);
  }

  const { error } = checkForCanceledStatus(trip);
  if (error) {
    throw new Error(error);
  }

  const { error: attrError } = isPassanger(trip, passangerId);
  if (attrError) {
    throw new Error(attrError);
  }

  const updatedTrip = await Trip.findByIdAndUpdate(
    trip.id,
    {
      status: TripStatus.CANCELED,
    },
    { new: true }
  );

  if (!updatedTrip || updatedTrip === null) {
    throw new Error(ENDPOINT_ERRORS.tripNotFound);
  }

  return updatedTrip;
};

export const getUnfinishedTrip = async (userId: string) => {
  const trip = await Trip.findOne({
    $and: [
      { $or: [{ passengerId: userId }, { driverId: userId }] },
      {
        $and: [
          { status: { $ne: TripStatus.FINISHED } },
          { status: { $ne: TripStatus.CANCELED } },
        ],
      },
    ],
  });

  return trip;
};

export default Trip;
