import axios from 'axios';
import * as admin from 'firebase-admin';

import config from '../config';

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

const TOKEN_ENDPOINT =
  'https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=';

const auth = admin.auth();
export const getUserToken = async (uid: string) => {
  const customToken = await auth.createCustomToken(uid);
  try {
    const { data } = await axios.post(
      `${TOKEN_ENDPOINT}${config.firebase.apiKey}`,
      {
        token: customToken,
        returnSecureToken: true,
      }
    );
    return data.idToken;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export default auth;
