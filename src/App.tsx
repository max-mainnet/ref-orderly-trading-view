import * as React from 'react';
import './App.css';
import { TVChartContainer } from './components/TVChartContainer/index';
import { version } from './charting_library';
import { WalletSelectorContextProvider } from './WalletSelectorContext';
function App() {
  return (
    <div className={'App'}>
      <WalletSelectorContextProvider>
        <header className={'App-header'}>
          <h1 className={'App-title'}>TradingView Charting Library and React Integration Example {version()}</h1>
        </header>
        <TVChartContainer />
      </WalletSelectorContextProvider>
    </div>
  );
}

export default App;
