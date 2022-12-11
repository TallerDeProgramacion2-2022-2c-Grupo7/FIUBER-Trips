import { ATTRIUBTES_ERRORS } from '../constants/errors';
import { ITrip } from '../interfaces/trip';

export const isDriver = (trip: ITrip, driverId: string) => {
  if (trip.driverId !== driverId) {
    return { error: ATTRIUBTES_ERRORS.isNotDriver };
  }
  return { error: null };
};

export const isPassanger = (trip: ITrip, passangerId: string) => {
  if (trip.passengerId !== passangerId) {
    return { error: ATTRIUBTES_ERRORS.isNotPassenger };
  }
  return { error: null };
};
