import * as admin from 'firebase-admin';
import { DRIVER_FOUND, NEW_TRIP_AVAILABLE } from '../constants/notifications';

export const sendNewTripNotification = async () => {
  const message = NEW_TRIP_AVAILABLE;

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
  const message = DRIVER_FOUND(passengerDeviceId);

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
