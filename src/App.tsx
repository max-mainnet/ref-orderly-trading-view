import * as React from 'react';
import './App.css';
import { TVChartContainer, ChartContainer } from './components/TVChartContainer/index';
import { version } from './charting_library';
import { WalletSelectorContextProvider } from './WalletSelectorContext';
import { useMarketTrades } from './orderly/state';
import OrderlyContextProvider from './orderly/OrderlyContext';
import RecentTrade from './components/RecentTrade';
import OrderBook from './components/OrderBook';
function App() {
  return (
    <div className={'App'}>
      <WalletSelectorContextProvider>
        <OrderlyContextProvider>
          {/* <RecentTrade></RecentTrade> */}

          <div className='w-full flex border '>
            <div className='w-full border p-4 border-boxBorder rounded-2xl bg-opacity-10 bg-black'>
              <ChartContainer />
            </div>

            <div>
              <RecentTrade />

              <OrderBook></OrderBook>
            </div>
          </div>
        </OrderlyContextProvider>
      </WalletSelectorContextProvider>
    </div>
  );
}

export default App;
