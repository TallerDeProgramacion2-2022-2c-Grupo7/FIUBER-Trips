import { Schema, model } from 'mongoose';

export enum TripStatus {
  SERCHING_DRIVER = 'searching_driver',
  WAITING_DRIVER = 'waiting_driver',
  ACCEPTED = 'accepted',
  STARTED = 'started',
  FINISHED = 'finished',
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
  createdAt: Date;
}

export const LatLongSchema = new Schema<ILatLng>(
  {
    latitude: Number,
    longitude: Number,
  },
  { _id: false }
);

const MapPointSchema = new Schema<IMapPoint>(
  {
    coordinates: LatLongSchema,
    description: Object,
  },
  { _id: false }
);

const TripSchema = new Schema<ITrip>({
  passengerId: String,
  passengerDeviceId: String,
  driverId: String,
  from: MapPointSchema,
  to: MapPointSchema,
  cost: Number,
  status: {
    type: String,
    enum: Object.values(TripStatus),
  },
  paymentHash: String,
  createdAt: Date,
});

const Trip = model<ITrip>('Trip', TripSchema);

export default Trip;
