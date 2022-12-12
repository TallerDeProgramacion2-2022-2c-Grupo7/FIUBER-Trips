/* eslint-disable import/prefer-default-export */
export const mockSendMessaging = jest
  .fn()
  .mockReturnValue(new Promise(resolve => resolve('Mocked sent')));
const mockMessaging = jest.fn().mockReturnValue({ send: mockSendMessaging });

jest.mock('firebase-admin', () => {
  return {
    apps: [
      'testAppId',
    ] /** this array should not be empty, so firebase-admin won't try to load a certificate when running unit tests */,
    auth: jest.fn(),
    firestore: jest.fn(),
    messaging: () => mockMessaging(),
  };
});

jest.mock('../../src/services/auth', () => {
  return {
    verifyIdToken: jest.fn().mockReturnValue({ uid: 'test' }),
    getUser: jest.fn().mockReturnValue({ uid: 'test' }),
    getUserToken: jest.fn().mockReturnValue('testToken'),
  };
});

jest.mock('axios', () => {
  return {
    post: jest.fn(),
  };
});

jest.mock('coingecko-api', () => {
  return jest.fn().mockImplementation(() => {
    return {
      simple: {
        price: jest.fn().mockReturnValue({ data: { ethereum: { ars: 1 } } }),
      },
    };
  });
});
