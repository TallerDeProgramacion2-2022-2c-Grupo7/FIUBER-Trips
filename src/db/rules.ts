import { Schema, model } from 'mongoose';
import { ILatLng, LatLongSchema } from './trips';

export interface IRulesWeights {
  driverTripsOfDay: number;
  driverTripsOfMonth: number;
  driverActiveDays: number;
  driverPickupDelay: number;
  passengerTripsOfDay: number;
  passengerTripsOfMonth: number;
  passengerActiveDays: number;
  tripDuration: number;
  tripLength: number;
  tripsInLastTimeWindow: number;
  timeWindowSize: number;
}

export interface IRulesDiscounts {
  zone: number;
  zoneCenter: ILatLng;
  zoneRadius: number;
  time: number;
  timeDays: string[];
  timeHours: number[];
  paymentCredit: number;
  paymentDebit: number;
}

export interface IRules {
  weights: IRulesWeights;
  discounts: IRulesDiscounts;
}

const RulesWeightSchema = new Schema<IRulesWeights>(
  {
    driverTripsOfDay: Number,
    driverTripsOfMonth: Number,
    driverActiveDays: Number,
    driverPickupDelay: Number,
    passengerTripsOfDay: Number,
    passengerTripsOfMonth: Number,
    passengerActiveDays: Number,
    tripDuration: Number,
    tripLength: Number,
    tripsInLastTimeWindow: Number,
    timeWindowSize: Number,
  },
  { _id: false }
);

const RulesDiscountSchema = new Schema<IRulesDiscounts>(
  {
    zone: Number,
    zoneCenter: LatLongSchema,
    zoneRadius: Number,
    time: Number,
    timeDays: Array,
    timeHours: Array,
    paymentCredit: Number,
    paymentDebit: Number,
  },
  { _id: false }
);

const RulesSchema = new Schema<IRules>({
  weights: RulesWeightSchema,
  discounts: RulesDiscountSchema,
});

const Rules = model<IRules>('Rules', RulesSchema);

export default Rules;
