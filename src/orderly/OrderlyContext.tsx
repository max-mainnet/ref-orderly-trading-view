import React, { useContext, createContext, useState, useEffect } from 'react';
import { useOrderlyMarketData } from './off-chain-ws';
import { MarketTrade, Orders, Trade } from './type';
import { useMarketTrades } from './state';

interface OrderlyContextValue {
  orders: Orders | undefined;
  marketTrade: MarketTrade | undefined;
  lastJsonMessage: any;
  symbol: string;
  setSymbol: (symbol: string) => void;
  recentTrades: Trade[];
}

export const OrderlyContext = createContext<OrderlyContextValue | null>(null);

const OrderlyContextProvider: React.FC<any> = ({ children }) => {
  const [symbol, setSymbol] = useState<string>('SPOT_NEAR_USDC');

  const value = useOrderlyMarketData({
    symbol,
  });

  const recentTrades = useMarketTrades({
    symbol,
    limit: 20,
  });

  return (
    <OrderlyContext.Provider
      value={{
        ...value,
        symbol,
        setSymbol,
        recentTrades,
      }}
    >
      {children}
    </OrderlyContext.Provider>
  );
};

export default OrderlyContextProvider;

export function useOrderlyContext() {
  const context = React.useContext(OrderlyContext);

  if (!context) {
    throw new Error('useOrderly must be used within a OrderlyContextProvider');
  }

  return context;
}
