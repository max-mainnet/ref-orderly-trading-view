import React, { useState, useEffect, useContext } from 'react';
import { OrderlyContext, useOrderlyContext } from '../../orderly/OrderlyContext';
import moment from 'moment';

export function parseSymbol(fullName: string) {
  return {
    symbolFrom: fullName.split('_')[1],
    symbolTo: fullName.split('_')[2],
  };
}

function formatTime(ts: number) {
  return moment(ts).format('HH:mm:ss');
}

function RecentTrade() {
  //   const value = useOrderlyContext();
  //   console.log('value: ', value);

  const { recentTrades, symbol } = useOrderlyContext();
  console.log('recentTrades: ', recentTrades);

  const { symbolFrom, symbolTo } = parseSymbol(symbol);

  //   console.log('recentTrades: ', recentTrades);

  return (
    <>
      <div className='flex mr-4 mb-1 items-center text-xs text-primary justify-between '>
        <div>
          <span>Price</span>

          <span className='text-white rounded-md ml-1 p-1 bg-primary bg-opacity-10'>{symbolTo}</span>
        </div>

        <div>
          <span>Size</span>

          <span className='text-white rounded-md ml-1 p-1 bg-primary bg-opacity-10'>{symbolFrom}</span>
        </div>

        <div>Time</div>
      </div>

      <section
        className='overflow-auto text-xs'
        style={{
          height: '490px',
        }}
      >
        {recentTrades.map((trade, i) => {
          return (
            <div key={'recent-trade-' + i} className='grid mr-2 mt-2.5 grid-cols-3 justify-items-end'>
              <span className={`justify-self-start ${trade.side === 'BUY' ? 'text-buyGreen' : 'text-sellRed'}`}>{trade.executed_price}</span>
              <span className='text-white'>{trade.executed_quantity}</span>

              <span className='justify-self-end text-primary'>{formatTime(trade.executed_timestamp)}</span>
            </div>
          );
        })}
      </section>
    </>
  );
}

export default RecentTrade;
