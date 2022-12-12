export enum TripStatus {
  SERCHING_DRIVER = 'searching_driver',
  WAITING_DRIVER = 'waiting_driver',
  ACCEPTED = 'accepted',
  STARTED = 'started',
  FINISHED = 'finished',
  CANCELED = 'canceled',
}

export interface ILatLng {
  latitude: number;
  longitude: number;
}

export interface IMapPoint {
  coordinates: ILatLng;
  description: {
    name: string;
    formattedAddress: { mainText: string; secondaryText: string };
  };
}

export interface ITrip {
  passengerId: string;
  passengerDeviceId: string;
  driverId?: string;
  from: IMapPoint;
  to: IMapPoint;
  cost: number;
  status: TripStatus;
  paymentHash?: string;
  canceledDriver: string[];
  createdAt: Date;
}
