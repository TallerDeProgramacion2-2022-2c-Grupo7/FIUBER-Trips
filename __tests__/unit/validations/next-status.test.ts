import { STATUS_ERRORS } from '../../../src/constants/errors';
import { ITrip, TripStatus, IMapPoint } from '../../../src/interfaces/trip';
import {
  checkForAcceptStatus,
  checkForStartStatus,
  checkForFinishStatus,
  checkForCanceledStatus,
} from '../../../src/validations/next-status';

const mapPoint: IMapPoint = {
  coordinates: { latitude: 0, longitude: 0 },
  description: {
    name: '',
    formattedAddress: { mainText: '', secondaryText: '' },
  },
};

const generateTrip = () => {
  return {
    status: TripStatus.WAITING_DRIVER,
    passengerId: '',
    driverId: '',
    from: mapPoint,
    to: mapPoint,
    cost: 0,
    canceledDriver: [],
    createdAt: new Date(),
    passengerDeviceId: '',
  };
};

describe('Test checkForAcceptStatus', () => {
  let trip: ITrip;

  beforeEach(() => {
    trip = generateTrip();
  });

  test('WHEN trip is WAITING FOR DRIVER SHOULD return no error', async () => {
    trip.status = TripStatus.WAITING_DRIVER;

    expect(checkForAcceptStatus(trip)).toEqual({ error: null });
  });
  test('WHEN trip is not WAITING FOR DRIVER SHOULD return error', async () => {
    const statuses = Object.values(TripStatus);
    statuses.forEach(status => {
      if (status !== TripStatus.WAITING_DRIVER) {
        trip.status = status as TripStatus;
        expect(checkForAcceptStatus(trip)).toEqual({
          error: STATUS_ERRORS.tripNotAvailable,
        });
      }
    });
  });
});

describe('Test checkForStartStatus', () => {
  let trip: ITrip;

  beforeEach(() => {
    trip = generateTrip();
  });

  test('WHEN trip is ACCEPTED SHOULD return no error', async () => {
    trip.status = TripStatus.ACCEPTED;

    expect(checkForStartStatus(trip)).toEqual({ error: null });
  });
  test('WHEN trip is not ACCEPTED SHOULD return error', async () => {
    const statuses = Object.values(TripStatus);
    statuses.forEach(status => {
      if (status !== TripStatus.ACCEPTED) {
        trip.status = status as TripStatus;
        expect(checkForStartStatus(trip)).toEqual({
          error: STATUS_ERRORS.tripNotAccepted,
        });
      }
    });
  });
});

describe('Test checkForFinishStatus', () => {
  let trip: ITrip;

  beforeEach(() => {
    trip = generateTrip();
  });

  test('WHEN trip is STARTED SHOULD return no error', async () => {
    trip.status = TripStatus.STARTED;

    expect(checkForFinishStatus(trip)).toEqual({ error: null });
  });
  test('WHEN trip is not STARTED SHOULD return error', async () => {
    const statuses = Object.values(TripStatus);
    statuses.forEach(status => {
      if (status !== TripStatus.STARTED) {
        trip.status = status as TripStatus;
        expect(checkForFinishStatus(trip)).toEqual({
          error: STATUS_ERRORS.tripNotStarted,
        });
      }
    });
  });
});

describe('Test checkForCanceledStatus', () => {
  let trip: ITrip;

  beforeEach(() => {
    trip = generateTrip();
  });

  test('WHEN trip is SERCHING_DRIVER SHOULD return no error', async () => {
    trip.status = TripStatus.SERCHING_DRIVER;

    expect(checkForCanceledStatus(trip)).toEqual({ error: null });
  });
  test('WHEN trip is not WAITING FOR DRIVER SHOULD return error', async () => {
    const statuses = Object.values(TripStatus);
    statuses.forEach(status => {
      if (status !== TripStatus.SERCHING_DRIVER) {
        trip.status = status as TripStatus;
        expect(checkForCanceledStatus(trip)).toEqual({
          error: STATUS_ERRORS.tripAlreadyStarted,
        });
      }
    });
  });
});
