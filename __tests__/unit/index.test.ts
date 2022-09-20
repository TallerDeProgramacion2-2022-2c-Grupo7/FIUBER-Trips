import request from 'supertest';
import app from '../../src/app';

describe('Test Hello Word Endpoin', () => {
  test('should return code 200', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });
});
