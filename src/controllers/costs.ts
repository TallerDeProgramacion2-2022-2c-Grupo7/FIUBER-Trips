/* eslint-disable import/prefer-default-export */
import { Request, Response } from 'express';
import { calculateCost } from '../utils/costs';
import Rules from '../db/rules';
import Trip from '../db/trips';

export const calculate = async (req: Request, res: Response) => {
  const { tripParams } = req.body;
  const trip = new Trip({ ...tripParams, createdAt: new Date() });
  const rules = await Rules.findOne().sort({ _id: -1 });
  const cost = calculateCost(trip, rules!);
  return res.status(200).json({ result: cost });
};
