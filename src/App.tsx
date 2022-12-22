import * as React from 'react';
import './App.css';
import { TVChartContainer } from './components/TVChartContainer/index';
import { version } from './charting_library';
function App() {
  return (
    <div className={'App'}>
      <div className='py-10'>wwewewew</div>
      <header className={'App-header'}>
        <h1 className={'App-title'}>TradingView Charting Library and React Integration Example {version()}</h1>
      </header>
      <TVChartContainer />
    </div>
  );
}

export default App;
