/* eslint-disable import/no-unresolved */
import { Request, Response, NextFunction } from 'express';
import { credential } from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';
import { getAuth, UserRecord } from 'firebase-admin/auth';

export interface AuthenticatedRequest extends Request {
  user?: UserRecord;
}

const firebaseConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

const firebaseApp = initializeApp({
  projectId: firebaseConfig.projectId,
  credential: credential.cert(firebaseConfig),
});
const auth = getAuth(firebaseApp);

const firebaseAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({ error: 'Not authorization token' });
    }
    console.log(authorization);
    const token = await auth.verifyIdToken(authorization);
    req.user = await auth.getUser(token.uid);
    return next();
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

export default firebaseAuth;
