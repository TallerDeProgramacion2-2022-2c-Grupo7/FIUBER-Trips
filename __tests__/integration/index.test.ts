import request from 'supertest';
import app from '../../src/app';

jest.mock('firebase-admin', () => {
  return {
    apps: [
      'testAppId',
    ] /** this array should not be empty, so firebase-admin won't try to load a certificate when running unit tests */,
    auth: jest.fn(),
    firestore: jest.fn(),
  };
});

describe('Test Hello Word Endpoin', () => {
  test('should return code 200', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });
});
