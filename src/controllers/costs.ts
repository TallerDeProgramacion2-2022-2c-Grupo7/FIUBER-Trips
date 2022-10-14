/* eslint-disable import/prefer-default-export */
import { Request, Response } from 'express';
import { calculateCost } from '../utils/costs';

export const calculate = (req: Request, res: Response) => {
  const { from, to } = req.body;
  const cost = calculateCost(from, to);
  return res.status(200).json({ result: cost });
};
