import { Response } from 'express';
import Rules from '../db/rules';
import { AuthenticatedRequest } from '../middlewares/auth';

// eslint-disable-next-line import/prefer-default-export
export const newRules = async (req: AuthenticatedRequest, res: Response) => {
  const bodyData = req.body;
  // const { user } = req;
  const rulesRecord = new Rules(bodyData);
  await rulesRecord.save();
  res.status(201).json({ result: rulesRecord.toJSON() });
};
