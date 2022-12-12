import { ATTRIUBTES_ERRORS } from '../../../src/constants/errors';
import { ITrip, TripStatus, IMapPoint } from '../../../src/interfaces/trip';
import { isDriver, isPassanger } from '../../../src/validations/attributes';

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

describe('Test isDriver', () => {
  let trip: ITrip;
  const driverId = 'driverId';
  const otherDriverId = 'otherDriverId';

  beforeEach(() => {
    trip = generateTrip();
  });

  test("WHEN trip's driverId match return no error", async () => {
    trip.driverId = driverId;

    expect(isDriver(trip, driverId)).toEqual({ error: null });
  });

  test("WHEN trip's driverId is other return error", async () => {
    trip.driverId = otherDriverId;

    expect(isDriver(trip, driverId)).toEqual({
      error: ATTRIUBTES_ERRORS.isNotDriver,
    });
  });

  test("WHEN trip's driverId is undefined return error", async () => {
    trip.driverId = undefined;

    expect(isDriver(trip, driverId)).toEqual({
      error: ATTRIUBTES_ERRORS.isNotDriver,
    });
  });
});

describe('Test isPassanger', () => {
  let trip: ITrip;
  const passengerId = 'passengerId';
  const otherPassengerId = 'otherPassengerId';

  beforeEach(() => {
    trip = generateTrip();
  });

  test("WHEN trip's passangerId match return no error", async () => {
    trip.passengerId = passengerId;

    expect(isPassanger(trip, passengerId)).toEqual({ error: null });
  });

  test("WHEN trip's passangerId is other return error", async () => {
    trip.passengerId = otherPassengerId;

    expect(isPassanger(trip, passengerId)).toEqual({
      error: ATTRIUBTES_ERRORS.isNotPassenger,
    });
  });
});
