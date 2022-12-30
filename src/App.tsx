import * as React from 'react';
import './App.css';
import { TVChartContainer, ChartContainer } from './components/TVChartContainer/index';
import { version } from './charting_library';
import { WalletSelectorContextProvider } from './WalletSelectorContext';
import { useMarketTrades } from './orderly/state';
import OrderlyContextProvider from './orderly/OrderlyContext';
import RecentTrade from './components/RecentTrade';
import OrderBook from './components/OrderBook';
import ChartHeader from './components/ChartHeader';
function App() {
  return (
    <div className={'App'}>
      <WalletSelectorContextProvider>
        <OrderlyContextProvider>
          {/* <RecentTrade></RecentTrade> */}

          <div className='w-full flex border '>
            <div
              className='w-full border p-4 border-boxBorder rounded-2xl bg-cardBg'
              style={{
                height: '540px',
              }}
            >
              <ChartHeader></ChartHeader>
              <ChartContainer />
            </div>

            <div>
              <OrderBook />

              <RecentTrade />
            </div>
          </div>
        </OrderlyContextProvider>
      </WalletSelectorContextProvider>
    </div>
  );
}

export default App;
