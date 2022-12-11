/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import { getUserToken } from './auth';
import { getArsValueInETH } from './exchange';

const ENDPOINT = 'https://fiuber-wallet-aleacevedo.cloud.okteto.net';

export const executePayment = async (from, to, amount) => {
  const amountInETH = await getArsValueInETH(amount);
  const token = await getUserToken(from);
  if (!token) return undefined;
  try {
    const { data } = await axios.post(
      `${ENDPOINT}/deposit`,
      {
        senderId: from,
        receiverId: to,
        amountInEthers: amountInETH.toFixed(18),
      },
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    return data.result;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};
