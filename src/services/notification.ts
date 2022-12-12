import * as admin from 'firebase-admin';

export const sendNewTripNotification = async () => {
  const message = {
    notification: {
      title: 'New trip available',
      body: 'You have an available trip',
    },
    topic: 'availableTrips',
  };

  try {
    await admin
      .messaging()
      .send(message)
      .then(response => {
        console.log('Successfully sent message:', response);
      });
  } catch (error) {
    console.log('Error sending new trip message:', error);
  }
};

export const sendTripAcceptedNotification = async (
  passengerDeviceId: string
) => {
  const message = {
    notification: {
      title: 'Driver found',
      body: 'A driver was found for your trip',
    },
    token: passengerDeviceId,
  };

  try {
    await admin
      .messaging()
      .send(message)
      .then(response => {
        console.log('Successfully sent message:', response);
      });
  } catch (errorSending) {
    console.log('Error sending driver found message:', errorSending);
  }
};
