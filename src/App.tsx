import * as React from 'react';
import './App.css';
import { TVChartContainer, ChartContainer } from './components/TVChartContainer/index';
import { ToastContainer } from 'react-toastify';
import { version } from './charting_library';
import { WalletSelectorContextProvider, WalletSelectorContextWindowProvider, useWalletSelectorWindow } from './WalletSelectorContext';
import OrderlyContextProvider from './orderly/OrderlyContext';
import OrderBook from './components/OrderBook';
import ChartHeader from './components/ChartHeader';
import UserBoard from './components/UserBoard';
import OrderBoard from './components/OrderBoard';
import AllOrders from './components/AllOrders';

import { BrowserRouter as Router, Switch, Route, useLocation, useHistory } from 'react-router-dom';

import Big from 'big.js';
import { get_orderly_private_key_path, tradingKeyMap } from './orderly/utils';

Big.RM = 0;

function TradingBoard() {
  const { accountId, modal, selector } = useWalletSelectorWindow();
  console.log('modal11: ', modal);
  console.log('accountId11: ', accountId);
  console.log('selector11: ', selector);

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
  window.onbeforeunload = () => {
    const priKeyPath = get_orderly_private_key_path();

    const pubKeyPath = get_orderly_private_key_path();

    tradingKeyMap.get(priKeyPath) && localStorage.setItem(priKeyPath, tradingKeyMap.get(priKeyPath));

    tradingKeyMap.get(pubKeyPath) && localStorage.setItem(pubKeyPath, tradingKeyMap.get(pubKeyPath));
  };

  window.onload = () => {
    const priKeyPath = get_orderly_private_key_path();

    const pubKeyPath = get_orderly_private_key_path();

    const priKey = localStorage.getItem(priKeyPath);

    const pubKey = localStorage.getItem(pubKeyPath);

    priKey && tradingKeyMap.set(priKeyPath, priKey);

    pubKey && tradingKeyMap.set(pubKeyPath, pubKey);
  };

  return (
    <div className={'App'}>
      <WalletSelectorContextProvider>
        <WalletSelectorContextWindowProvider>
          <OrderlyContextProvider>
            {/* <RecentTrade></RecentTrade> */}
            <Router>
              <Switch>
                <Route path='/orderly/all-orders' component={AllOrders} />

                <Route path='/' component={TradingBoard} />
              </Switch>
            </Router>

            <ToastContainer />
          </OrderlyContextProvider>
        </WalletSelectorContextWindowProvider>
      </WalletSelectorContextProvider>
    </div>
  );
}

export default App;
