import CoinGecko from 'coingecko-api';

const coinGeckClient = new CoinGecko();

export const getExchangeRates = async (coin, fiat) => {
  const { data } = await coinGeckClient.simple.price({
    ids: coin,
    vs_currencies: fiat,
  });

  return data;
};

export const getArsValueInETH = async (arsValue: number) => {
  const exchangeRates = await getExchangeRates('ethereum', 'ars');
  const ethValue = arsValue / exchangeRates.ethereum.ars;

  return ethValue;
};
