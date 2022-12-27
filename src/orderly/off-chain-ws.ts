import useWebSocket, { ReadyState } from 'react-use-websocket';
import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { OrderlyWSConnection, Orders, MarketTrade } from './type';
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
      event: 'subscribe',
      topic: `${symbol}@trade`,
    },
    // {
    //   id: `${symbol}@bbo`,
    //   event: 'subscribe',
    //   topic: `${symbol}@bbo`,
    // },
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

  const [marketTrade, setMarketTrade] = useState<MarketTrade>();

  // function unSubscribe() {
  //   if (!preSubScription || preSubScription.size === 0) return;

  //   preSubScription.forEach((s) => {
  //     if (s.event === 'subscribe') {
  //       sendMessage(
  //         JSON.stringify({
  //           ...s,
  //           event: 'unsubscribe',
  //         })
  //       );
  //     }
  //   });

  //   preSubScription.clear();
  // }

  // useEffect(() => {
  //   unSubscribe();
  // }, [symbol]);

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
    if (lastJsonMessage?.topic === `${symbol}@orderbookupdate` && !!orders) {
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
    if (lastJsonMessage?.topic === `${symbol}@trade`) {
      setMarketTrade(lastJsonMessage.data);
    }
  }, [lastJsonMessage]);

  return {
    lastJsonMessage,
    marketTrade,
    orders,
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
