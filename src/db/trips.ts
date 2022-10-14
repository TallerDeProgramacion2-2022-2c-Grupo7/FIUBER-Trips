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

export interface ITrip {
  userId: string;
  driverId?: string;
  from: ILatLng;
  to: ILatLng;
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

const TripSchema = new Schema<ITrip>({
  userId: String,
  driverId: String,
  from: LatLongSchema,
  to: LatLongSchema,
  cost: Number,
  status: {
    type: String,
    enum: Object.values(TripStatus),
  },
  createdAt: Date,
});

const Trip = model<ITrip>('Trip', TripSchema);

export default Trip;
