import * as React from 'react';
import './App.css';
import { TVChartContainer, ChartContainer } from './components/TVChartContainer/index';
import { ToastContainer } from 'react-toastify';
import { version } from './charting_library';
import { WalletSelectorContextProvider } from './WalletSelectorContext';
import OrderlyContextProvider from './orderly/OrderlyContext';
import OrderBook from './components/OrderBook';
import ChartHeader from './components/ChartHeader';
import UserBoard from './components/UserBoard';
import OrderBoard from './components/OrderBoard';
import AllOrders from './components/AllOrders';

import { BrowserRouter as Router, Switch, Route, useLocation, useHistory } from 'react-router-dom';

import Big from 'big.js';

Big.RM = 0;

function TradingBoard() {
  return (
    <div className='w-full flex  pl-4 pt-3'>
      <div className='w-4/5 flex flex-col'>
        <div
          className='w-full flex'
          style={{
            height: '570px',
          }}
        >
          <div className='w-3/4 border p-4   border-boxBorder rounded-2xl bg-cardBg'>
            <ChartHeader></ChartHeader>
            <ChartContainer />
          </div>

          <div className='w-1/4 mx-3'>
            <OrderBook />
          </div>
        </div>
        <div className='mr-3 mt-3'>
          <OrderBoard></OrderBoard>
        </div>
      </div>

      <div className='w-1/5'>
        <UserBoard></UserBoard>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className={'App'}>
      <WalletSelectorContextProvider>
        <OrderlyContextProvider>
          {/* <RecentTrade></RecentTrade> */}
          <Router>
            <Switch>
              <Route path='/all-orders' component={AllOrders} />

              <Route path='/' component={TradingBoard} />
            </Switch>
          </Router>

          <ToastContainer />
        </OrderlyContextProvider>
      </WalletSelectorContextProvider>
    </div>
  );
}

export default App;
