import { faker } from '@faker-js/faker';
import { pickBy } from 'lodash';

import { ITrip, TripStatus } from '../src/interfaces/trip';

export const generateTrip = (trip?: Partial<ITrip>): ITrip => {
  const cleneadTrip = pickBy(trip);
  return {
    driverId: faker.datatype.uuid(),
    passengerId: faker.datatype.uuid(),
    from: {
      coordinates: {
        latitude: parseInt(faker.address.latitude(), 10),
        longitude: parseInt(faker.address.longitude(), 10),
      },
      description: {
        name: faker.address.streetAddress(),
        formattedAddress: {
          mainText: faker.address.streetAddress(),
          secondaryText: faker.address.streetAddress(),
        },
      },
    },
    to: {
      coordinates: {
        latitude: parseInt(faker.address.latitude(), 10),
        longitude: parseInt(faker.address.longitude(), 10),
      },
      description: {
        name: faker.address.streetAddress(),
        formattedAddress: {
          mainText: faker.address.streetAddress(),
          secondaryText: faker.address.streetAddress(),
        },
      },
    },
    cost: faker.datatype.number(),
    status: faker.helpers.arrayElement(Object.values(TripStatus)),
    createdAt: faker.date.past(),
    canceledDriver: [],
    paymentHash: faker.datatype.uuid(),
    passengerDeviceId: faker.datatype.uuid(),
    ...cleneadTrip,
  };
};

export const generateSearchinDriver = ({
  driverId,
  passengerId,
}: {
  driverId?: string;
  passengerId?: string;
}): ITrip => {
  return generateTrip({
    status: TripStatus.SERCHING_DRIVER,
    driverId,
    passengerId,
  });
};

export const generateWaitingDriver = ({
  driverId,
  passengerId,
}: {
  driverId?: string;
  passengerId?: string;
}): ITrip => {
  return generateTrip({
    status: TripStatus.WAITING_DRIVER,
    driverId,
    passengerId,
  });
};

export const generateAccepted = ({
  driverId,
  passengerId,
}: {
  driverId?: string;
  passengerId?: string;
}): ITrip => {
  return generateTrip({
    status: TripStatus.ACCEPTED,
    driverId,
    passengerId,
  });
};

export const generateStarted = ({
  driverId,
  passengerId,
}: {
  driverId?: string;
  passengerId?: string;
}): ITrip => {
  return generateTrip({
    status: TripStatus.STARTED,
    driverId,
    passengerId,
  });
};

export const generateFinished = ({
  driverId,
  passengerId,
}: {
  driverId?: string;
  passengerId?: string;
}): ITrip => {
  return generateTrip({
    status: TripStatus.FINISHED,
    driverId,
    passengerId,
  });
};

export const generateCanceled = ({
  driverId,
  passengerId,
}: {
  driverId?: string;
  passengerId?: string;
}): ITrip => {
  return generateTrip({
    status: TripStatus.CANCELED,
    driverId,
    passengerId,
  });
};

export const generateNTrips = (n: number): ITrip[] => {
  return Array.from({ length: n }, generateTrip);
};

export const generateNewTripParams = () => {
  return {
    from: {
      coordinates: {
        latitude: parseInt(faker.address.latitude(), 10),
        longitude: parseInt(faker.address.longitude(), 10),
      },
      description: {
        name: faker.address.streetAddress(),
        formattedAddress: {
          mainText: faker.address.streetAddress(),
          secondaryText: faker.address.streetAddress(),
        },
      },
    },
    to: {
      coordinates: {
        latitude: parseInt(faker.address.latitude(), 10),
        longitude: parseInt(faker.address.longitude(), 10),
      },
      description: {
        name: faker.address.streetAddress(),
        formattedAddress: {
          mainText: faker.address.streetAddress(),
          secondaryText: faker.address.streetAddress(),
        },
      },
    },
  };
};

export const getARule = () => {
  return {
    weights: {
      driverTripsOfDay: 11,
      driverTripsOfMonth: 20,
      driverActiveDays: 5,
      driverPickupDelay: -2,
      passengerTripsOfDay: -10,
      passengerTripsOfMonth: -30,
      passengerActiveDays: 0,
      tripDuration: 75,
      tripLength: 80,
      tripsInLastTimeWindow: 50,
    },
    discounts: {
      zone: 10,
      time: 15,
      paymentCredit: 15,
      paymentDebit: 20,
    },
    parameters: {
      timeWindowSize: 60,
      zoneCenter: {
        latitude: -312313,
        longitude: 123123,
      },
      zoneRadius: 1000,
      timeDays: ['MON', 'FRI'],
      timeHours: [20, 23],
    },
  };
};

export const generateRandomUUID = () => faker.datatype.uuid();
