/* eslint-disable import/no-unresolved */
import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';
import { UserRecord } from 'firebase-admin/auth';

import config from '../config';

export interface AuthenticatedRequest extends Request {
  user?: UserRecord;
}

const devUser = {
  uid: 'PEU8bBVrBxa2RzjklhARkCW6ulY2',
  email: 'dev@fiuber.uba.ar',
};

const firebaseConfig = {
  projectId: config.firebase.projectId,
  privateKey: config.firebase.privateKey,
  clientEmail: config.firebase.clientEmail,
};

if (!admin.apps.length) {
  /** See https://stackoverflow.com/a/57764002/2516673 */
  admin.initializeApp({
    projectId: firebaseConfig.projectId,
    credential: admin.credential.cert(firebaseConfig),
  });
}

const auth = admin.auth();

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
