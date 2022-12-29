import React from 'react';
import { useOrderlyContext } from '../../orderly/OrderlyContext';

function parseSymbol(fullName: string) {
  return {
    symbolFrom: fullName.split('_')[1],
    symbolTo: fullName.split('_')[2],
  };
}

function OrderBook() {
  const { orders, marketTrade, symbol } = useOrderlyContext();
  console.log('marketTrade: ', marketTrade);

  console.log('orders: ', orders);
  const { symbolFrom, symbolTo } = parseSymbol(symbol);

  return (
    <div
      className='w-1/5 border border-boxBorder text-sm rounded-2xl bg-opacity-10 bg-black p-4 '
      style={{
        minWidth: '320px',
      }}
    >
      <div className='text-white text-left mb-2'>Orderbook</div>

      <div className='flex items-center text-primary justify-between '>
        <div>
          <span>Price</span>

          <span className='text-white rounded-md ml-1 p-1 bg-primary bg-opacity-10'>{symbolTo}</span>
        </div>

        <div>
          <span>Size</span>

          <span className='text-white rounded-md ml-1 p-1 bg-primary bg-opacity-10'>{symbolFrom}</span>
        </div>

        <div>Total</div>
      </div>

      {/* sell  */}
      <section></section>

      {/* market trade */}

      <div className={`text-center ${marketTrade?.side === 'BUY' ? 'text-buyGreen' : 'text-sellRed'} text-lg`}>{marketTrade && marketTrade?.price}</div>

      {/* buy */}

      <section></section>
    </div>
  );
}

export default OrderBook;
