import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Trade } from './type';
import { getMarketTrades } from './off-chain-api';

const useIntervalAsync = <R = unknown>(fn: () => Promise<R>, ms: number) => {
  const runningCount = useRef(0);
  const timeout = useRef<number>();
  const mountedRef = useRef(false);

  const next = useCallback(
    (handler: TimerHandler) => {
      if (mountedRef.current && runningCount.current === 0) {
        timeout.current = window.setTimeout(handler, ms);
      }
    },
    [ms]
  );

  const run = useCallback(async () => {
    runningCount.current += 1;
    const result = await fn();
    runningCount.current -= 1;

    next(run);

    return result;
  }, [fn, next]);

  useEffect(() => {
    mountedRef.current = true;
    run();

    return () => {
      mountedRef.current = false;
      window.clearTimeout(timeout.current);
    };
  }, [run]);

  const flush = useCallback(() => {
    window.clearTimeout(timeout.current);
    return run();
  }, [run]);

  return flush;
};

export function useMarketTrades({ symbol, limit }: { symbol: string; limit: number }) {
  const [trades, setTrades] = useState<Trade[]>([]);

  const setFunc = useCallback(async () => {
    try {
      const res = await getMarketTrades({ symbol, limit });
      setTrades(res?.data?.rows);
    } catch (error) {}
  }, [symbol, limit]);

  useIntervalAsync(setFunc, 3000);

  return trades;
}
