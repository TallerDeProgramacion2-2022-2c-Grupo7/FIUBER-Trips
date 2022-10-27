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
}

export interface IRulesDiscounts {
  zone: number;
  time: number;
  paymentCredit: number;
  paymentDebit: number;
}

export interface IParameters {
  timeWindowSize: number;
  zoneCenter: ILatLng;
  zoneRadius: number;
  timeDays: string[];
  timeHours: number[];
}

export interface IRules {
  weights: IRulesWeights;
  discounts: IRulesDiscounts;
  parameters: IParameters;
  datetime: Date;
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
  },
  { _id: false }
);

const ParametersSchema = new Schema<IParameters>(
  {
    timeWindowSize: Number,
    zoneCenter: LatLongSchema,
    zoneRadius: Number,
    timeDays: Array,
    timeHours: Array,
  },
  { _id: false }
);

const RulesDiscountSchema = new Schema<IRulesDiscounts>(
  {
    zone: Number,
    time: Number,
    paymentCredit: Number,
    paymentDebit: Number,
  },
  { _id: false }
);

const RulesSchema = new Schema<IRules>({
  weights: RulesWeightSchema,
  discounts: RulesDiscountSchema,
  parameters: ParametersSchema,
  datetime: Date,
});

const Rules = model<IRules>('Rules', RulesSchema);

export default Rules;
