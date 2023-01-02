import useWebSocket, { ReadyState } from 'react-use-websocket';
import React, { useState, useCallback, useEffect, useRef, useMemo, StrictMode } from 'react';
import { OrderlyWSConnection, Orders, MarketTrade, Ticker, MarkPrice } from './type';
import { getOrderlyConfig } from '../config';
import { useWalletSelector } from '../WalletSelectorContext';
import { getPublicKey, generateRequestSignatureHeader, toNonDivisibleNumber } from './utils';
import { NotSignInError } from './error';
import { getOrderlyWss } from './constant';

function useInterval(callback: Function, delay: number) {
  const latestCallback = useRef<Function>(() => {});

  useEffect(() => {
    latestCallback.current = callback;
  });

  useEffect(() => {
    if (delay !== null) {
      const interval = setInterval(() => latestCallback.current(), delay || 0);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [delay]);
}

export const REF_ORDERLY_WS_ID_PREFIX = 'orderly_ws_';

export const useOrderlyWS = () => {
  const { accountId } = useWalletSelector();

  const [socketUrl, setSocketUrl] = useState(getOrderlyWss());

  const [messageHistory, setMessageHistory] = useState<any>([]);

  const { lastMessage, readyState, lastJsonMessage, sendMessage } = useWebSocket(socketUrl);

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev: any) => prev.concat(lastMessage));
    }
  }, [lastMessage, setMessageHistory]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  return {
    connectionStatus,
    messageHistory,
    lastMessage,
    sendMessage,
    lastJsonMessage,
  };
};
export const usePrivateOrderlyWS = () => {
  const { accountId } = useWalletSelector();

  const [socketUrl, setSocketUrl] = useState(getOrderlyConfig().ORDERLY_WS_ENDPOINT_PRIVATE + `/${accountId}`);

  const [messageHistory, setMessageHistory] = useState<any>([]);

  const { lastMessage, readyState, lastJsonMessage, sendMessage } = useWebSocket(socketUrl);

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev: any) => prev.concat(lastMessage));
    }
  }, [lastMessage, setMessageHistory]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  return {
    connectionStatus,
    messageHistory,
    lastMessage,
    sendMessage,
    lastJsonMessage,
  };
};

export const generateMarketDataFlow = ({ symbol }: { symbol: string }) => {
  const data: OrderlyWSConnection[] = [
    {
      id: `request-order-${symbol}`,
      event: 'request',
      params: {
        symbol,
        type: 'orderbook',
      },
    },
    {
      id: `${symbol}@orderbookupdate`,
      event: 'subscribe',
      topic: `${symbol}@orderbookupdate`,
    },
    {
      id: `${symbol}@trade`,
      event: 'request',
      topic: `${symbol}@trade`,
      params: {
        type: 'trade',
        symbol,
        limit: 50,
      },
    },
    {
      id: `markprices`,
      event: 'subscribe',
      topic: `markprices`,
      ts: Date.now(),
    },
    {
      id: `${symbol}@trade`,
      event: 'subscribe',
      topic: `${symbol}@trade`,
    },
    {
      id: `tickers`,
      event: 'subscribe',
      topic: `tickers`,
    },
  ];

  return data;
};
export const initDataFlow = ({ symbol }: { symbol: string }) => {
  let data: OrderlyWSConnection[] = [
    {
      id: `request-order-${symbol}`,
      event: 'request',
      params: {
        symbol,
        type: 'orderbook',
      },
    },
    {
      topic: `${symbol}@kline_1m`,
      event: 'subscribe',
      id: `${symbol}@kline_1m`,
    },
  ];

  return data;
};

const preSubScription = new Map<string, OrderlyWSConnection>();

export const useOrderlyMarketData = ({ symbol }: { symbol: string }) => {
  const { connectionStatus, messageHistory, lastMessage, lastJsonMessage, sendMessage } = useOrderlyWS();

  const [orders, setOrders] = useState<Orders>();

  const [ticker, setTicker] = useState<Ticker>();

  const [marketTrade, setMarketTrade] = useState<MarketTrade>();

  const [markPrices, setMarkPrices] = useState<MarkPrice[]>();

  // subscribe
  useEffect(() => {
    const msgFlow = generateMarketDataFlow({
      symbol,
    });

    // setPreSubScription(msgFlow);

    // check symbol

    // preSubScription.clear();

    msgFlow.forEach((msg) => {
      const id = msg.id;

      if (!id) return;

      if (preSubScription.has(id + '|' + symbol)) return;

      preSubScription.set(id + '|' + symbol, msg);

      sendMessage(JSON.stringify(msg));
    });
  }, [symbol]);

  // onmessage
  useEffect(() => {
    // update orderbook

    if (lastJsonMessage?.event === 'ping') {
      sendMessage(JSON.stringify({ event: 'pong', ts: Date.now() + 500 }));
    }

    if (lastJsonMessage?.id === `request-order-${symbol}` && lastJsonMessage?.event === 'request') {
      setOrders(lastJsonMessage.data);
    }

    // process orderbook update
    if (lastJsonMessage?.id === `${symbol}@orderbookupdate` && !!orders) {
      // setOrders(lastJsonMessage.data);

      let asks = orders.asks;

      lastJsonMessage.data.asks.forEach((ask: number[]) => {
        const price = ask[0];
        const quantity = ask[1];
        const index = asks.findIndex((a) => a[0] === price);

        if (index === -1) {
          asks.push(ask);
        } else {
          if (quantity === 0) {
            asks.splice(index, 1);
          } else {
            asks[index] = ask;
          }
        }
      });

      let bids = orders.bids;

      lastJsonMessage.data.bids.forEach((bid: number[]) => {
        const price = bid[0];
        const quantity = bid[1];
        const index = bids.findIndex((a) => a[0] === price);

        if (index === -1) {
          bids.push(bid);
        } else {
          if (quantity === 0) {
            bids.splice(index, 1);
          } else {
            bids[index] = bid;
          }
        }
      });

      setOrders({
        ...orders,
        asks,
        bids,
        ts: lastJsonMessage.ts,
      });
    }

    //  process trade
    if (lastJsonMessage?.id === `${symbol}@trade`) {
      if (lastJsonMessage?.event === 'request') {
        setMarketTrade(lastJsonMessage.data[0]);
      } else setMarketTrade(lastJsonMessage.data);
    }

    if (lastJsonMessage?.topic === 'tickers') {
      const tickers = lastJsonMessage.data;

      const ticker = tickers.find((t: Ticker) => t.symbol === symbol);

      if (ticker) setTicker(ticker);
    }

    if (lastJsonMessage?.topic === 'markprices') {
      const markPrices = lastJsonMessage.data;

      setMarkPrices(markPrices);
    }
  }, [lastJsonMessage]);

  return {
    lastJsonMessage,
    marketTrade,
    orders,
    ticker,
    markPrices,
  };
};

export const useOrderlyPrivateData = () => {
  const { connectionStatus, messageHistory, lastMessage, sendMessage, lastJsonMessage } = usePrivateOrderlyWS();

  const [authPass, setAuthPass] = useState(false);
  const { accountId } = useWalletSelector();
  const [lastSuccess, setLastSuccess] = useState(false);

  const [initData, setInitData] = useState<OrderlyWSConnection[]>();

  const [orderlyKey, setOrderlyKey] = useState('');

  const [requestSignature, setRequestSignature] = useState('');

  const time_stamp = useMemo(() => Date.now(), []);

  useEffect(() => {
    if (!accountId) throw NotSignInError;

    generateRequestSignatureHeader({
      accountId,
      time_stamp,
      url: null,
      body: null,
    }).then(setRequestSignature);
  }, []);

  useEffect(() => {
    if (!accountId) throw NotSignInError;

    getPublicKey(accountId).then((res) => {
      setOrderlyKey(res);
    });
  }, []);

  useEffect(() => {
    if (!orderlyKey || !requestSignature) return;

    const authData = {
      id: '123r',
      event: 'auth',
      params: {
        timestamp: time_stamp,
        sign: requestSignature,
        orderly_key: orderlyKey,
      },
    };

    sendMessage(JSON.stringify(authData));
  }, [orderlyKey, requestSignature]);

  const handlePing = () => {
    if (!authPass) return;
    sendMessage(
      JSON.stringify({
        id: '',
        event: 'ping',
        ts: Date.now(),
      })
    );
  };

  useInterval(handlePing, 5000);

  useEffect(() => {
    if (lastJsonMessage && lastJsonMessage.event === 'auth' && lastJsonMessage.success === true) {
      setAuthPass(true);
    }
  }, [lastJsonMessage]);

  useEffect(() => {
    if (lastJsonMessage) {
      setLastSuccess(lastJsonMessage.success);
    }

    // handlePing();
  }, [lastJsonMessage]);

  return {
    connectionStatus,
    messageHistory,
    lastMessage,
    lastSuccess,
  };
};
