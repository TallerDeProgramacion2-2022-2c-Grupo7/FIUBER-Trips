/* eslint-disable import/no-unresolved */
import { Request, Response, NextFunction } from 'express';
import { UserRecord } from 'firebase-admin/auth';

import config from '../config';
import auth from '../services/auth';

export interface AuthenticatedRequest extends Request {
  user?: UserRecord;
}

const devUser = {
  uid: 'PEU8bBVrBxa2RzjklhARkCW6ulY2',
  email: 'dev@fiuber.uba.ar',
};

const firebaseAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;
  if (config.enviroment === 'development' && !authorization) {
    req.user = devUser as UserRecord;
    return next();
  }
  try {
    if (!authorization) {
      return res.status(401).json({ error: 'No authorization header' });
    }
    const token = await auth.verifyIdToken(authorization);
    req.user = await auth.getUser(token.uid);
    return next();
  } catch (error) {
    return res.status(401).json({ error: error.errorInfo });
  }
};

export default firebaseAuth;
