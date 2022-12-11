import { ITrip, ILatLng } from '../interfaces/trip';
import { IRules } from '../db/rules';

const datetimeMatches = (
  datetime: Date,
  days: Array<string>,
  hours: Array<number>
) => {
  const dayMappings = {
    mon: 1,
    tue: 2,
    wed: 3,
    thu: 4,
    fri: 5,
    sat: 6,
    sun: 7,
  };
  let dayMatches = false;
  let timeMatches = false;
  const day = datetime.getDay();
  const time = datetime.getHours();
  // eslint-disable-next-line no-restricted-syntax
  for (const d of days) {
    if (day === dayMappings[d.toLowerCase()]) {
      dayMatches = true;
    }
  }
  timeMatches = time >= hours[0] && time <= hours[1];
  return dayMatches && timeMatches;
};

export const calculateDistance = (from: ILatLng, to: ILatLng) => {
  const r = 6371;
  const deltaLatitud = (from.latitude - to.latitude) * (Math.PI / 180);
  const deltaLongitud = (from.longitude - to.longitude) * (Math.PI / 180);
  const latitud1 = from.latitude * (Math.PI / 180);
  const latitud2 = to.latitude * (Math.PI / 180);
  const a =
    Math.sin(deltaLatitud / 2) ** 2 +
    Math.cos(latitud1) * Math.cos(latitud2) * Math.sin(deltaLongitud / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return r * c * 1000;
};

// TODO: Mejorar esta función
export const calculateCost = (trip: ITrip, rules: IRules) => {
  let price = 0;
  const distance = calculateDistance(
    trip.from.coordinates,
    trip.to.coordinates
  );
  price += rules.weights.tripLength * distance;

  const availableDiscounts: number[] = [];

  // Descuento por zona geográfica
  const discountZoneValue = rules.discounts.zone;
  const center = rules.parameters.zoneCenter;
  const radius = rules.parameters.zoneRadius;
  if (
    discountZoneValue > 0 &&
    calculateDistance(trip.from.coordinates, center) <= radius
  ) {
    availableDiscounts.push(discountZoneValue);
  }

  // Descuento por día y hora de inicio de viaje
  const tripCreatedAt = trip.createdAt;
  const discountTimeValue = rules.discounts.time;
  const days = rules.parameters.timeDays;
  const hours = rules.parameters.timeHours;
  if (datetimeMatches(tripCreatedAt, days, hours)) {
    availableDiscounts.push(discountTimeValue);
  }

  const discountToApply =
    availableDiscounts.length > 0 ? Math.max(...availableDiscounts) : 0;

  price /= 1000;
  price -= price * (discountToApply / 100);

  return price;
};
