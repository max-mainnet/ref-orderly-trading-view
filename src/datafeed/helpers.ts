// Make requests to CryptoCompare API

import { getOrderlyConfig } from '../config';

export async function makePublicApiRequest(path: string) {
  try {
    const response = await fetch(`${getOrderlyConfig().OFF_CHAIN_END_POINT}/${path}`);
    return response.json();
  } catch {
    throw new Error(`Symbol request Error`);
  }
}

// Generate a symbol ID from a pair of the coins
export function generateSymbol(exchange: string, fromSymbol: string, toSymbol: string) {
  const short = `${fromSymbol}/${toSymbol}`;
  return {
    short,
    full: `${exchange}:${short}`,
  };
}

export function parseFullSymbol(fullSymbol: string) {
  console.log('fullSymbol: ', fullSymbol);

  const match = fullSymbol.match(/^(\w+):(\w+)_(\w+)_(\w+)$/);
  if (!match) {
    return null;
  }

  return {
    exchange: match[1],
    fromSymbol: match[3],
    toSymbol: match[4],
  };
}
