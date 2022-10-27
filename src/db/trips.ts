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
  cordigantes: ILatLng;
  description: {
    name: string;
    formattedAddress: { mainText: string; secondaryText: string };
  };
}

export interface ITrip {
  passengerId: string;
  driverId?: string;
  from: IMapPoint;
  to: IMapPoint;
  cost: number;
  status: TripStatus;
  createdAt: Date;
}

const LatLongSchema = new Schema<ILatLng>(
  {
    latitude: Number,
    longitude: Number,
  },
  { _id: false }
);

const MapPointSchema = new Schema<IMapPoint>(
  {
    cordigantes: LatLongSchema,
    description: Object,
  },
  { _id: false }
);

const TripSchema = new Schema<ITrip>({
  passengerId: String,
  driverId: String,
  from: MapPointSchema,
  to: MapPointSchema,
  cost: Number,
  status: {
    type: String,
    enum: Object.values(TripStatus),
  },
  createdAt: Date,
});

const Trip = model<ITrip>('Trip', TripSchema);

export default Trip;
