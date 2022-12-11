import { STATUS_ERRORS } from '../constants/errors';
import { ITrip, TripStatus } from '../interfaces/trip';

export const checkForAcceptStatus = (trip: ITrip) => {
  if (trip.status !== TripStatus.WAITING_DRIVER) {
    return { error: STATUS_ERRORS.tripNotAvailable };
  }
  return { error: null };
};

export const checkForStartStatus = (trip: ITrip) => {
  if (trip.status !== TripStatus.ACCEPTED) {
    return { error: STATUS_ERRORS.tripNotAccepted };
  }
  return { error: null };
};

export const checkForFinishStatus = (trip: ITrip) => {
  if (trip.status !== TripStatus.STARTED) {
    return { error: STATUS_ERRORS.tripNotStarted };
  }
  return { error: null };
};

export const checkForCanceledStatus = (trip: ITrip) => {
  if (trip.status !== TripStatus.SERCHING_DRIVER) {
    return { error: STATUS_ERRORS.tripAlreadyStarted };
  }
  return { error: null };
};
