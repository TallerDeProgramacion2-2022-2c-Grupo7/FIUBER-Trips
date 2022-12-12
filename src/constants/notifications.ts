export const NEW_TRIP_AVAILABLE = {
  notification: {
    title: 'New trip available',
    body: 'You have an available trip',
  },
  topic: 'availableTrips',
};

export const DRIVER_FOUND = (passengerDeviceId: string) => {
  return {
    notification: {
      title: 'Driver found',
      body: 'A driver was found for your trip',
    },
    token: passengerDeviceId,
  };
};
