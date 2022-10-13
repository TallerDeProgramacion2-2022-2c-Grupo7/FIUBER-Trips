import { Request, Response, NextFunction } from 'express';
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getAuth, UserRecord } from 'firebase-admin/auth';

export interface AuthenticatedRequest extends Request {
  user?: UserRecord;
}

const firebaseApp = initializeApp({
  credential: applicationDefault(),
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
    const token = await auth.verifyIdToken(authorization);
    req.user = await auth.getUser(token.uid);
    return next();
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

export default firebaseAuth;
