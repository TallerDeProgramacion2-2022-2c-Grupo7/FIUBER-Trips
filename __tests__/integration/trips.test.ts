/* eslint-disable import/order */
/* eslint-disable no-underscore-dangle */

import { mockSendMessaging } from '../__mocks__';

import request from 'supertest';
import { connect } from 'mongoose';
import axios from 'axios';

import app from '../../src/app';
import {
  generateAccepted,
  generateCanceled,
  generateFinished,
  generateNewTripParams,
  generateNTrips,
  generateSearchinDriver,
  generateStarted,
  generateTrip,
  generateWaitingDriver,
  getARule,
} from '../utils';
import Trip, { getOneAvailableTrip } from '../../src/db/trips';
import auth from '../../src/services/auth';
import { TripStatus } from '../../src/interfaces/trip';
import Rules from '../../src/db/rules';
import { calculateCost } from '../../src/utils/costs';
import {
  DRIVER_FOUND,
  NEW_TRIP_AVAILABLE,
} from '../../src/constants/notifications';
import {
  ATTRIUBTES_ERRORS,
  ENDPOINT_ERRORS,
  STATUS_ERRORS,
} from '../../src/constants/errors';

describe('Test trips endpoint', () => {
  const baseEndpoint = '/api/trips';
  let connection;
  beforeAll(async () => {
    connection = await connect(global.__MONGO_URI__);
  });

  describe('GET /api/trips', () => {
    test('should return code 200', async () => {
      const response = await request(app)
        .get(baseEndpoint)
        .set('Authorization', 'superToken');
      expect(response.statusCode).toBe(200);
    });

    describe('WHEN there is one trip', () => {
      let trip;
      beforeEach(async () => {
        trip = generateTrip();

        await new Trip(trip).save();
      });

      afterEach(async () => {
        await Trip.deleteMany({});
      });

      test('SHOULD return one trip', async () => {
        const response = await request(app)
          .get(baseEndpoint)
          .set('Authorization', 'superToken');
        expect(response.body.result).toHaveLength(1);
      });

      test('SHOULD containe saved trip', async () => {
        const response = await request(app)
          .get(baseEndpoint)
          .set('Authorization', 'superToken');
        trip.createdAt = trip.createdAt.toISOString();
        expect(response.body.result[0]).toMatchObject(trip);
      });
    });

    describe('WHEN there is many trips', () => {
      let trips;
      beforeEach(async () => {
        trips = generateNTrips(20);

        await Promise.all(trips.map(trip => new Trip(trip).save()));
      });

      afterEach(async () => {
        await Trip.deleteMany({});
      });

      test('SHOULD return 10 trips', async () => {
        const response = await request(app)
          .get(baseEndpoint)
          .set('Authorization', 'superToken');
        expect(response.body.result).toHaveLength(10);
      });
    });
  });

  describe('GET /api/trips/unfinished', () => {
    const userUid = 'testUid';
    const testEndpoint = `${baseEndpoint}/unfinished`;

    beforeEach(() => {
      (auth.getUser as jest.Mock).mockReturnValue({ uid: userUid });
    });

    test('should return code 200', async () => {
      const response = await request(app)
        .get(testEndpoint)
        .set('Authorization', 'superToken');
      expect(response.statusCode).toBe(200);
    });

    describe('WHEN there is no unfinished trip', () => {
      let trips;
      beforeEach(async () => {
        trips = [
          ...generateNTrips(20),
          generateFinished({ driverId: userUid }),
          generateFinished({ passengerId: userUid }),
          generateCanceled({ passengerId: userUid }),
          generateCanceled({ driverId: userUid }),
        ];

        await Promise.all(trips.map(trip => new Trip(trip).save()));
      });

      afterEach(async () => {
        await Trip.deleteMany({});
      });

      test('SHOULD containe no trip', async () => {
        const response = await request(app)
          .get(testEndpoint)
          .set('Authorization', 'superToken');
        expect(response.body.result).toEqual(null);
      });
    });

    describe('WHEN there is one waitingForDriver trip', () => {
      let waitingDriverTrip;
      let trips;
      beforeEach(async () => {
        waitingDriverTrip = generateWaitingDriver({ driverId: userUid });

        trips = [
          ...generateNTrips(20),
          generateFinished({ driverId: userUid }),
          generateFinished({ passengerId: userUid }),
        ];

        await new Trip(waitingDriverTrip).save();
        await Promise.all(trips.map(trip => new Trip(trip).save()));
      });

      afterEach(async () => {
        await Trip.deleteMany({});
      });

      test('SHOULD containe saved trip', async () => {
        const response = await request(app)
          .get(testEndpoint)
          .set('Authorization', 'superToken');
        waitingDriverTrip.createdAt = waitingDriverTrip.createdAt.toISOString();
        expect(response.body.result).toMatchObject(waitingDriverTrip);
      });
    });

    describe('WHEN there is one started driver trip', () => {
      let startedTrip;
      let trips;
      beforeEach(async () => {
        startedTrip = generateStarted({ driverId: userUid });

        trips = [
          ...generateNTrips(20),
          generateFinished({ driverId: userUid }),
          generateFinished({ passengerId: userUid }),
        ];

        await new Trip(startedTrip).save();
        await Promise.all(trips.map(trip => new Trip(trip).save()));
      });

      afterEach(async () => {
        await Trip.deleteMany({});
      });

      test('SHOULD containe saved trip', async () => {
        const response = await request(app)
          .get(testEndpoint)
          .set('Authorization', 'superToken');
        startedTrip.createdAt = startedTrip.createdAt.toISOString();
        expect(response.body.result).toMatchObject(startedTrip);
      });
    });

    describe('WHEN there is one accepted trip', () => {
      let acceptedTrip;
      let trips;
      beforeEach(async () => {
        acceptedTrip = generateAccepted({ driverId: userUid });

        trips = [
          ...generateNTrips(20),
          generateFinished({ driverId: userUid }),
          generateFinished({ passengerId: userUid }),
        ];

        await new Trip(acceptedTrip).save();
        await Promise.all(trips.map(trip => new Trip(trip).save()));
      });

      afterEach(async () => {
        await Trip.deleteMany({});
      });

      test('SHOULD containe saved trip', async () => {
        const response = await request(app)
          .get(testEndpoint)
          .set('Authorization', 'superToken');
        acceptedTrip.createdAt = acceptedTrip.createdAt.toISOString();
        expect(response.body.result).toMatchObject(acceptedTrip);
      });
    });
  });

  describe('GET /api/trips/available', () => {
    const userUid = 'testUid';
    const testEndpoint = `${baseEndpoint}/available`;

    beforeEach(() => {
      (auth.getUser as jest.Mock).mockReturnValue({ uid: userUid });
    });

    test('should return code 200', async () => {
      const response = await request(app)
        .get(testEndpoint)
        .set('Authorization', 'superToken');
      expect(response.statusCode).toBe(200);
    });

    describe('WHEN there is no searchinDriver trip', () => {
      let trips;
      beforeEach(async () => {
        trips = [
          generateFinished({}),
          generateAccepted({}),
          generateCanceled({}),
          generateWaitingDriver({}),
        ];

        await Promise.all(trips.map(trip => new Trip(trip).save()));
      });

      afterEach(async () => {
        await Trip.deleteMany({});
      });

      test('SHOULD containe no trip', async () => {
        const response = await request(app)
          .get(testEndpoint)
          .set('Authorization', 'superToken');
        expect(response.body.result).toEqual(null);
      });
    });

    describe('WHEN there is one searchingDriver trip', () => {
      let searchinDriverTrip;
      let savedTrip;
      let trips;
      beforeEach(async () => {
        searchinDriverTrip = generateSearchinDriver({ driverId: userUid });

        trips = [
          generateFinished({}),
          generateAccepted({}),
          generateCanceled({}),
          generateWaitingDriver({}),
        ];

        savedTrip = await new Trip(searchinDriverTrip).save();
        await Promise.all(trips.map(trip => new Trip(trip).save()));
      });

      afterEach(async () => {
        await Trip.deleteMany({});
      });

      test('SHOULD containe saved trip', async () => {
        const response = await request(app)
          .get(testEndpoint)
          .set('Authorization', 'superToken');
        searchinDriverTrip.createdAt = searchinDriverTrip.createdAt.toISOString();
        searchinDriverTrip.status = TripStatus.WAITING_DRIVER;
        expect(response.body.result).toMatchObject(searchinDriverTrip);
      });

      test('SHOULD change status of saved trip', async () => {
        await request(app)
          .get(testEndpoint)
          .set('Authorization', 'superToken');

        const updatedTrip = await Trip.findById(savedTrip._id);
        expect(updatedTrip?.status).toEqual(TripStatus.WAITING_DRIVER);
      });
    });
  });

  describe('POST /api/trips', () => {
    const userUid = 'testUid';
    const testEndpoint = `${baseEndpoint}`;
    let savedRule;

    beforeEach(async () => {
      (auth.getUser as jest.Mock).mockReturnValue({ uid: userUid });
      const newRule = getARule();
      savedRule = await new Rules({
        ...newRule,
        datetime: new Date(),
      }).save();
    });

    describe('WHEN create a new trip', () => {
      let createTripParams;
      beforeEach(async () => {
        createTripParams = generateNewTripParams();
      });

      afterEach(async () => {
        await Trip.deleteMany({});
      });

      test('should return code 201', async () => {
        const response = await request(app)
          .post(testEndpoint)
          .send(createTripParams)
          .set('Authorization', 'superToken');
        expect(response.statusCode).toBe(201);
      });

      test('SHOULD response with a trip with params', async () => {
        const response = await request(app)
          .post(testEndpoint)
          .send(createTripParams)
          .set('Authorization', 'superToken');

        expect(response.body.result).toMatchObject(createTripParams);
      });

      test('SHOULD save a trip with params', async () => {
        const response = await request(app)
          .post(testEndpoint)
          .send(createTripParams)
          .set('Authorization', 'superToken');

        const updatedTrip = await Trip.findById(response.body.result._id);
        expect(updatedTrip).toMatchObject(createTripParams);
      });

      test('SHOULD save a trip with status searching driver', async () => {
        const response = await request(app)
          .post(testEndpoint)
          .send(createTripParams)
          .set('Authorization', 'superToken');

        const updatedTrip = await Trip.findById(response.body.result._id);
        expect(updatedTrip?.status).toEqual(TripStatus.SERCHING_DRIVER);
      });

      test('SHOULD save a trip with correct passangerId', async () => {
        const response = await request(app)
          .post(testEndpoint)
          .send(createTripParams)
          .set('Authorization', 'superToken');

        const updatedTrip = await Trip.findById(response.body.result._id);
        expect(updatedTrip?.passengerId).toEqual(userUid);
      });

      test('SHOULD save a trip with correct cost', async () => {
        const response = await request(app)
          .post(testEndpoint)
          .send(createTripParams)
          .set('Authorization', 'superToken');

        const trip = {
          ...createTripParams,
          passengerId: userUid,
          createdAt: new Date(),
          status: TripStatus.SERCHING_DRIVER,
          canceledDriver: [],
        };

        const cost = calculateCost(trip, savedRule);

        const updatedTrip = await Trip.findById(response.body.result._id);
        expect(updatedTrip?.cost).toEqual(cost);
      });

      test('SHOULD send notifiation', async () => {
        await request(app)
          .post(testEndpoint)
          .send(createTripParams)
          .set('Authorization', 'superToken');

        expect(mockSendMessaging).toHaveBeenCalledWith(NEW_TRIP_AVAILABLE);
      });
    });
  });

  describe('POST /api/trips/accept', () => {
    const userUid = 'testUid';
    const notSavedTrip = new Trip(generateTrip());
    const testEndpoint = (tripId: string) => `${baseEndpoint}/${tripId}/accept`;

    beforeEach(async () => {
      (auth.getUser as jest.Mock).mockReturnValue({ uid: userUid });
    });

    describe('WHEN accept a non created', () => {
      afterEach(async () => {
        await Trip.deleteMany({});
      });

      test('SHOULD return code 400', async () => {
        const response = await request(app)
          .post(testEndpoint(notSavedTrip._id.toString()))
          .set('Authorization', 'superToken');
        expect(response.statusCode).toBe(400);
      });

      test('SHOULD return message error', async () => {
        const response = await request(app)
          .post(testEndpoint(notSavedTrip._id.toString()))
          .set('Authorization', 'superToken');

        expect(response.body.error).toEqual(ENDPOINT_ERRORS.tripNotFound);
      });
    });

    describe('WHEN accept a waiting for driver trip', () => {
      let savedTrip;
      beforeEach(async () => {
        const trip = generateWaitingDriver({});

        savedTrip = await new Trip(trip).save();
      });

      afterEach(async () => {
        await Trip.deleteMany({});
      });

      test('SHOULD return code 200', async () => {
        const response = await request(app)
          .post(testEndpoint(savedTrip._id))
          .set('Authorization', 'superToken');

        expect(response.statusCode).toBe(200);
      });

      test('SHOULD updateStatus', async () => {
        const response = await request(app)
          .post(testEndpoint(savedTrip._id))
          .set('Authorization', 'superToken');

        const updatedTrip = await Trip.findById(response.body.result._id);
        expect(updatedTrip?.status).toEqual(TripStatus.ACCEPTED);
      });

      test('SHOULD send notifiation', async () => {
        await request(app)
          .post(testEndpoint(savedTrip._id))
          .set('Authorization', 'superToken');

        expect(mockSendMessaging).toHaveBeenCalledWith(
          DRIVER_FOUND(savedTrip.passengerDeviceId)
        );
      });
    });

    describe('WHEN accept a non waiting for driver trip', () => {
      let savedTrip;
      beforeEach(async () => {
        const trip = generateSearchinDriver({});

        savedTrip = await new Trip(trip).save();
      });

      afterEach(async () => {
        await Trip.deleteMany({});
      });

      test('SHOULD return code 400', async () => {
        const response = await request(app)
          .post(testEndpoint(savedTrip._id))
          .set('Authorization', 'superToken');

        expect(response.statusCode).toBe(400);
      });

      test('SHOULD return message error', async () => {
        const response = await request(app)
          .post(testEndpoint(savedTrip._id))
          .set('Authorization', 'superToken');

        expect(response.body.error).toEqual(ENDPOINT_ERRORS.tripNotAvailable);
      });

      test('SHOULD not updateStatus', async () => {
        await request(app)
          .post(testEndpoint(savedTrip._id))
          .set('Authorization', 'superToken');

        const updatedTrip = await Trip.findById(savedTrip._id);
        expect(updatedTrip?.status).toEqual(TripStatus.SERCHING_DRIVER);
      });
    });
  });

  describe('POST /api/trips/reject', () => {
    const userUid = 'testUid';
    const notSavedTrip = new Trip(generateTrip());
    const testEndpoint = (tripId: string) => `${baseEndpoint}/${tripId}/reject`;

    beforeEach(async () => {
      (auth.getUser as jest.Mock).mockReturnValue({ uid: userUid });
    });

    describe('WHEN reject a non created', () => {
      afterEach(async () => {
        await Trip.deleteMany({});
      });

      test('SHOULD return code 400', async () => {
        const response = await request(app)
          .post(testEndpoint(notSavedTrip._id.toString()))
          .set('Authorization', 'superToken');
        expect(response.statusCode).toBe(400);
      });

      test('SHOULD return message error', async () => {
        const response = await request(app)
          .post(testEndpoint(notSavedTrip._id.toString()))
          .set('Authorization', 'superToken');

        expect(response.body.error).toEqual(ENDPOINT_ERRORS.tripNotFound);
      });
    });

    describe('WHEN reject a waiting for driver trip', () => {
      let savedTrip;
      beforeEach(async () => {
        const trip = generateWaitingDriver({});

        savedTrip = await new Trip(trip).save();
      });

      afterEach(async () => {
        await Trip.deleteMany({});
      });

      test('SHOULD return code 200', async () => {
        const response = await request(app)
          .post(testEndpoint(savedTrip._id))
          .set('Authorization', 'superToken');

        expect(response.statusCode).toBe(200);
      });

      test('SHOULD update status', async () => {
        const response = await request(app)
          .post(testEndpoint(savedTrip._id))
          .set('Authorization', 'superToken');

        const updatedTrip = await Trip.findById(response.body.result._id);
        expect(updatedTrip?.status).toEqual(TripStatus.SERCHING_DRIVER);
      });

      test('SHOULD update list of canceled drivers', async () => {
        const response = await request(app)
          .post(testEndpoint(savedTrip._id))
          .set('Authorization', 'superToken');

        const updatedTrip = await Trip.findById(response.body.result._id);
        expect(updatedTrip?.canceledDriver).toContain(userUid);
      });

      test('SHOULD not receive it again as available', async () => {
        await request(app)
          .post(testEndpoint(savedTrip._id))
          .set('Authorization', 'superToken');

        expect(getOneAvailableTrip(userUid)).resolves.toBeNull();
      });
    });

    describe('WHEN reject a non waiting for driver trip', () => {
      let savedTrip;
      beforeEach(async () => {
        const trip = generateSearchinDriver({});

        savedTrip = await new Trip(trip).save();
      });

      afterEach(async () => {
        await Trip.deleteMany({});
      });

      test('SHOULD return code 400', async () => {
        const response = await request(app)
          .post(testEndpoint(savedTrip._id))
          .set('Authorization', 'superToken');

        expect(response.statusCode).toBe(400);
      });

      test('SHOULD return message error', async () => {
        const response = await request(app)
          .post(testEndpoint(savedTrip._id))
          .set('Authorization', 'superToken');

        expect(response.body.error).toEqual(ENDPOINT_ERRORS.tripNotAvailable);
      });

      test('SHOULD not updateStatus', async () => {
        await request(app)
          .post(testEndpoint(savedTrip._id))
          .set('Authorization', 'superToken');

        const updatedTrip = await Trip.findById(savedTrip._id);
        expect(updatedTrip?.status).toEqual(TripStatus.SERCHING_DRIVER);
      });
    });
  });

  describe('POST /api/trips/start', () => {
    const userUid = 'testUid';
    const notSavedTrip = new Trip(generateTrip());
    const testEndpoint = (tripId: string) => `${baseEndpoint}/${tripId}/start`;

    beforeEach(async () => {
      (auth.getUser as jest.Mock).mockReturnValue({ uid: userUid });
    });

    describe('WHEN start a non created', () => {
      afterEach(async () => {
        await Trip.deleteMany({});
      });

      test('SHOULD return code 400', async () => {
        const response = await request(app)
          .post(testEndpoint(notSavedTrip._id.toString()))
          .set('Authorization', 'superToken');
        expect(response.statusCode).toBe(400);
      });

      test('SHOULD return message error', async () => {
        const response = await request(app)
          .post(testEndpoint(notSavedTrip._id.toString()))
          .set('Authorization', 'superToken');

        expect(response.body.error).toEqual(ENDPOINT_ERRORS.tripNotFound);
      });
    });

    describe('WHEN start a accepted trip', () => {
      let savedTrip;
      beforeEach(async () => {
        const trip = generateAccepted({ driverId: userUid });

        savedTrip = await new Trip(trip).save();
      });

      afterEach(async () => {
        await Trip.deleteMany({});
      });

      test('SHOULD return code 200', async () => {
        const response = await request(app)
          .post(testEndpoint(savedTrip._id))
          .set('Authorization', 'superToken');

        expect(response.statusCode).toBe(200);
      });

      test('SHOULD updateStatus', async () => {
        const response = await request(app)
          .post(testEndpoint(savedTrip._id))
          .set('Authorization', 'superToken');

        const updatedTrip = await Trip.findById(response.body.result._id);
        expect(updatedTrip?.status).toEqual(TripStatus.STARTED);
      });
    });

    describe('WHEN start a non accepted trip', () => {
      let savedTrip;
      beforeEach(async () => {
        const trip = generateSearchinDriver({});

        savedTrip = await new Trip(trip).save();
      });

      afterEach(async () => {
        await Trip.deleteMany({});
      });

      test('SHOULD return code 400', async () => {
        const response = await request(app)
          .post(testEndpoint(savedTrip._id))
          .set('Authorization', 'superToken');

        expect(response.statusCode).toBe(400);
      });

      test('SHOULD return message error', async () => {
        const response = await request(app)
          .post(testEndpoint(savedTrip._id))
          .set('Authorization', 'superToken');

        expect(response.body.error).toEqual(STATUS_ERRORS.tripNotAccepted);
      });

      test('SHOULD not updateStatus', async () => {
        await request(app)
          .post(testEndpoint(savedTrip._id))
          .set('Authorization', 'superToken');

        const updatedTrip = await Trip.findById(savedTrip._id);
        expect(updatedTrip?.status).toEqual(TripStatus.SERCHING_DRIVER);
      });
    });
  });

  describe('POST /api/trips/finsih', () => {
    const userUid = 'testUid';
    const anotherUserUid = 'anotherUserUid';
    const notSavedTrip = new Trip(generateTrip());
    const testEndpoint = (tripId: string) => `${baseEndpoint}/${tripId}/finish`;
    const hash = 'testHash';

    beforeEach(async () => {
      (auth.getUser as jest.Mock).mockReturnValue({ uid: userUid });
    });

    describe('WHEN finsih a non created', () => {
      afterEach(async () => {
        await Trip.deleteMany({});
        (axios.post as jest.Mock).mockReturnValue({
          data: { result: { hash } },
        });
      });

      test('SHOULD return code 400', async () => {
        const response = await request(app)
          .post(testEndpoint(notSavedTrip._id.toString()))
          .set('Authorization', 'superToken');
        expect(response.statusCode).toBe(400);
      });

      test('SHOULD return message error', async () => {
        const response = await request(app)
          .post(testEndpoint(notSavedTrip._id.toString()))
          .set('Authorization', 'superToken');

        expect(response.body.error).toEqual(ENDPOINT_ERRORS.tripNotFound);
      });

      test('SHOULD not call payment service', async () => {
        await request(app)
          .post(testEndpoint(notSavedTrip._id.toString()))
          .set('Authorization', 'superToken');

        expect(axios.post).not.toHaveBeenCalled();
      });
    });

    describe('WHEN finish a accepted trip', () => {
      let savedTrip;
      beforeEach(async () => {
        const trip = generateStarted({
          driverId: userUid,
          passengerId: anotherUserUid,
        });

        savedTrip = await new Trip(trip).save();
      });

      afterEach(async () => {
        await Trip.deleteMany({});
      });

      test('SHOULD return code 200', async () => {
        const response = await request(app)
          .post(testEndpoint(savedTrip._id))
          .set('Authorization', 'superToken');

        expect(response.statusCode).toBe(200);
      });

      test('SHOULD updateStatus', async () => {
        const response = await request(app)
          .post(testEndpoint(savedTrip._id))
          .set('Authorization', 'superToken');

        const updatedTrip = await Trip.findById(response.body.result._id);
        expect(updatedTrip?.status).toEqual(TripStatus.FINISHED);
      });

      test('SHOULD update tx payment hash', async () => {
        const response = await request(app)
          .post(testEndpoint(savedTrip._id))
          .set('Authorization', 'superToken');

        const updatedTrip = await Trip.findById(response.body.result._id);
        expect(updatedTrip?.paymentHash).toEqual(hash);
      });

      test('SHOULD call payment service', async () => {
        await request(app)
          .post(testEndpoint(savedTrip._id))
          .set('Authorization', 'superToken');

        expect(axios.post).toHaveBeenLastCalledWith(
          expect.any(String),
          expect.objectContaining({
            amountInEthers: savedTrip.cost.toFixed(18),
            receiverId: userUid,
            senderId: anotherUserUid,
          }),
          expect.objectContaining({
            headers: expect.objectContaining({ Authorization: 'testToken' }),
          })
        );
      });
    });

    describe('WHEN finsih a non started trip', () => {
      let savedTrip;
      beforeEach(async () => {
        const trip = generateSearchinDriver({});

        savedTrip = await new Trip(trip).save();
      });

      afterEach(async () => {
        await Trip.deleteMany({});
        (axios.post as jest.Mock).mockClear();
      });

      test('SHOULD return code 400', async () => {
        const response = await request(app)
          .post(testEndpoint(savedTrip._id))
          .set('Authorization', 'superToken');

        expect(response.statusCode).toBe(400);
      });

      test('SHOULD return message error', async () => {
        const response = await request(app)
          .post(testEndpoint(savedTrip._id))
          .set('Authorization', 'superToken');

        expect(response.body.error).toEqual(STATUS_ERRORS.tripNotStarted);
      });

      test('SHOULD not updateStatus', async () => {
        await request(app)
          .post(testEndpoint(savedTrip._id))
          .set('Authorization', 'superToken');

        const updatedTrip = await Trip.findById(savedTrip._id);
        expect(updatedTrip?.status).toEqual(TripStatus.SERCHING_DRIVER);
      });

      test('SHOULD not call payment service', async () => {
        await request(app)
          .post(testEndpoint(notSavedTrip._id.toString()))
          .set('Authorization', 'superToken');

        expect(axios.post).not.toHaveBeenCalled();
      });
    });
  });

  describe('POST /api/trips/cancel', () => {
    const userUid = 'testUid';
    const notSavedTrip = new Trip(generateTrip());
    const testEndpoint = (tripId: string) => `${baseEndpoint}/${tripId}/cancel`;

    beforeEach(async () => {
      (auth.getUser as jest.Mock).mockReturnValue({ uid: userUid });
    });

    describe('WHEN cancel a non created', () => {
      afterEach(async () => {
        await Trip.deleteMany({});
      });

      test('SHOULD return code 400', async () => {
        const response = await request(app)
          .post(testEndpoint(notSavedTrip._id.toString()))
          .set('Authorization', 'superToken');
        expect(response.statusCode).toBe(400);
      });

      test('SHOULD return message error', async () => {
        const response = await request(app)
          .post(testEndpoint(notSavedTrip._id.toString()))
          .set('Authorization', 'superToken');

        expect(response.body.error).toEqual(ENDPOINT_ERRORS.tripNotFound);
      });
    });

    describe('WHEN cancel a seraching for driver trip', () => {
      let savedTrip;
      beforeEach(async () => {
        const trip = generateSearchinDriver({ passengerId: userUid });

        savedTrip = await new Trip(trip).save();
      });

      afterEach(async () => {
        await Trip.deleteMany({});
      });

      test('SHOULD return code 200', async () => {
        const response = await request(app)
          .post(testEndpoint(savedTrip._id))
          .set('Authorization', 'superToken');

        expect(response.statusCode).toBe(200);
      });

      test('SHOULD updateStatus', async () => {
        const response = await request(app)
          .post(testEndpoint(savedTrip._id))
          .set('Authorization', 'superToken');

        const updatedTrip = await Trip.findById(response.body.result._id);
        expect(updatedTrip?.status).toEqual(TripStatus.CANCELED);
      });
    });

    describe('WHEN cancel a non waiting for driver trip', () => {
      let savedTrip;
      beforeEach(async () => {
        const trip = generateAccepted({ passengerId: userUid });

        savedTrip = await new Trip(trip).save();
      });

      afterEach(async () => {
        await Trip.deleteMany({});
      });

      test('SHOULD return code 400', async () => {
        const response = await request(app)
          .post(testEndpoint(savedTrip._id))
          .set('Authorization', 'superToken');

        expect(response.statusCode).toBe(400);
      });

      test('SHOULD return message error', async () => {
        const response = await request(app)
          .post(testEndpoint(savedTrip._id))
          .set('Authorization', 'superToken');

        expect(response.body.error).toEqual(STATUS_ERRORS.tripAlreadyStarted);
      });

      test('SHOULD not updateStatus', async () => {
        await request(app)
          .post(testEndpoint(savedTrip._id))
          .set('Authorization', 'superToken');

        const updatedTrip = await Trip.findById(savedTrip._id);
        expect(updatedTrip?.status).toEqual(TripStatus.ACCEPTED);
      });
    });

    describe('WHEN cancel a non user trip', () => {
      let savedTrip;
      beforeEach(async () => {
        const trip = generateSearchinDriver({});

        savedTrip = await new Trip(trip).save();
      });

      afterEach(async () => {
        await Trip.deleteMany({});
      });

      test('SHOULD return code 400', async () => {
        const response = await request(app)
          .post(testEndpoint(savedTrip._id))
          .set('Authorization', 'superToken');

        expect(response.statusCode).toBe(400);
      });

      test('SHOULD return message error', async () => {
        const response = await request(app)
          .post(testEndpoint(savedTrip._id))
          .set('Authorization', 'superToken');

        expect(response.body.error).toEqual(ATTRIUBTES_ERRORS.isNotPassenger);
      });

      test('SHOULD not updateStatus', async () => {
        await request(app)
          .post(testEndpoint(savedTrip._id))
          .set('Authorization', 'superToken');

        const updatedTrip = await Trip.findById(savedTrip._id);
        expect(updatedTrip?.status).toEqual(TripStatus.SERCHING_DRIVER);
      });
    });
  });

  afterAll(async () => {
    await connection.disconnect();
  });
});
