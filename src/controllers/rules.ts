import { Response } from 'express';
import Rules from '../db/rules';
import { AuthenticatedRequest } from '../middlewares/auth';

export const getActiveRules = async (
  _req: AuthenticatedRequest,
  res: Response
) => {
  const rules = await Rules.findOne().sort({ _id: -1 });
  if (!rules) {
    return res.status(404).json({ result: null });
  }

  // TODO: Ver si conviene mover esta query
  // a otro endpoint e implementar paginación.
  const updateHistory = await Rules.find(
    {},
    { weights: 0, discounts: 0, parameters: 0, __v: 0 }
  );
  return res.status(200).json({
    result: { ...rules.toJSON(), updateHistory },
  });
};

export const getRulesById = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const rules = await Rules.findById(req.params.ruleId);
  if (!rules) {
    return res.status(404).json({ result: null });
  }
  return res.status(200).json({ result: rules.toJSON() });
};

export const updateRules = async (req: AuthenticatedRequest, res: Response) => {
  const rulesRecord = new Rules({ ...req.body, datetime: new Date() });
  await rulesRecord.save();
  res.status(201).json({ result: rulesRecord.toJSON() });
};
