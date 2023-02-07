import React, { useEffect, useState } from 'react';
import { nearMetadata, getFTmetadata, ftGetBalance } from '../../near';
import { toReadableNumber } from '../../orderly/utils';

export function useTokenBalance(tokenId: string | undefined) {
  const [tokenMeta, setTokenMeta] = useState<any>();
  const [walletBalance, setWalletBalance] = useState<string>('');

  useEffect(() => {
    if (!tokenId) return;
    if (tokenId === 'near') {
      setTokenMeta(nearMetadata);
    } else
      getFTmetadata(tokenId).then((meta) => {
        setTokenMeta(meta);
      });
  }, [tokenId]);

  useEffect(() => {
    if (!tokenId || !tokenMeta) return;
    ftGetBalance(tokenId).then((balance) => {
      setWalletBalance(toReadableNumber(tokenMeta.decimals, balance));
    });
  }, [tokenId, tokenMeta]);

  return walletBalance;
}
