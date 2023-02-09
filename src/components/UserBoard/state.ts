import React, { useEffect, useState } from 'react';
import { nearMetadata, getFTmetadata, ftGetBalance } from '../../near';
import { toReadableNumber } from '../../orderly/utils';

export function useTokenBalance(tokenId: string | undefined) {
  const [tokenMeta, setTokenMeta] = useState<any>();
  const [walletBalance, setWalletBalance] = useState<string>('');

  useEffect(() => {
    if (!tokenId) return;
    console.log('tokenId111: ', tokenId);

    getFTmetadata(tokenId).then((meta) => {
      console.log('meta11: ', meta, tokenId);
      setTokenMeta(meta);
    });
  }, [tokenId]);

  useEffect(() => {
    if (!tokenId || !tokenMeta) return;
    ftGetBalance(tokenMeta?.id).then((balance) => {
      console.log('token meta', tokenMeta, tokenId);

      setWalletBalance(toReadableNumber(tokenMeta.decimals, balance));
    });
  }, [tokenId, tokenMeta?.id]);

  return !tokenMeta || !tokenId ? '0' : walletBalance;
}
