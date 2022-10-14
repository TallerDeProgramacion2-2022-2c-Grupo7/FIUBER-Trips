import { ILatLng } from '../db/trips';

export const calculateDistance = (from: ILatLng, to: ILatLng) => {
  // euclidean distance
  const x = from.latitude - to.latitude;
  const y = from.longitude - to.longitude;
  return Math.sqrt(x * x + y * y);
};

export const calculateCost = (from: ILatLng, to: ILatLng) => {
  const distance = calculateDistance(from, to);
  const time = 10;
  return distance * 0.5 + time * 0.5;
};
