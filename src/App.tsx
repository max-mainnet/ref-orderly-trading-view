import * as React from 'react';
import './App.css';
import { TVChartContainer } from './components/TVChartContainer/index';
import { version } from './charting_library';
import { WalletSelectorContextProvider } from './WalletSelectorContext';
import { useMarketTrades } from './orderly/state';
import OrderlyContextProvider from './orderly/OrderlyContext';
import RecentTrade from './components/RecentTrade';
function App() {
  return (
    <div className={'App'}>
      <WalletSelectorContextProvider>
        <OrderlyContextProvider>
          {/* <RecentTrade></RecentTrade> */}
          <header className={'App-header'}>
            <h1 className={'App-title'}>TradingView Charting Library and React Integration Example {version()}</h1>
          </header>
          <TVChartContainer />
        </OrderlyContextProvider>
      </WalletSelectorContextProvider>
    </div>
  );
}

export default App;
