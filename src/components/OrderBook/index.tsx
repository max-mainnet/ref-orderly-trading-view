import React, { useRef, useEffect, useState } from 'react';
import { useOrderlyContext } from '../../orderly/OrderlyContext';
import RecentTrade from '../RecentTrade';

function parseSymbol(fullName: string) {
  return {
    symbolFrom: fullName.split('_')[1],
    symbolTo: fullName.split('_')[2],
  };
}

function OrderBook() {
  const { orders, marketTrade, symbol } = useOrderlyContext();

  const { symbolFrom, symbolTo } = parseSymbol(symbol);
  const [tab, setTab] = useState<'recent' | 'book'>('book');

  return (
    <div
      className='w-full  border border-boxBorder text-sm rounded-2xl bg-black bg-opacity-10 p-4 '
      style={{
        height: '570px',
      }}
    >
      <div className='flex mb-2 border-b border-white border-opacity-10 items-center '>
        <div
          onClick={() => {
            setTab('book');
          }}
          className={`cursor-pointer text-left ${tab === 'book' ? 'text-white' : 'text-primary'} font-bold mb-1`}
        >
          Orderbook
        </div>
        <div
          onClick={() => {
            setTab('recent');
          }}
          className={`cursor-pointer text-left ${tab === 'recent' ? 'text-white' : 'text-primary'} ml-3 font-bold mb-1`}
        >
          Recent Trade
        </div>
      </div>

      {tab === 'book' && (
        <>
          <div className='flex items-center text-xs mb-2 mr-4 text-primary justify-between '>
            <div>
              <span>Price</span>

              <span className='text-white rounded-md ml-1 p-1 bg-primary bg-opacity-10'>{symbolTo}</span>
            </div>

            <div>
              <span>Size</span>

              <span className='text-white rounded-md ml-1 p-1 bg-primary bg-opacity-10'>{symbolFrom}</span>
            </div>

            <div>Total Size</div>
          </div>

          {/* sell  */}
          <section
            className='text-xs flex flex-col-reverse overflow-auto text-white '
            id='sell-order-book-panel'
            style={{
              height: '225px',
            }}
          >
            {orders?.asks.map((order, i) => {
              return (
                <div className='grid hover:bg-symbolHover grid-cols-3 mr-2 py-1 justify-items-end' key={'orderbook-ask-' + i}>
                  <span className='text-sellRed justify-self-start'>{order[0]}</span>

                  <span className=''>{order[1]}</span>

                  <span>{(order[1] * order[0]).toFixed(2)}</span>
                </div>
              );
            })}
          </section>

          {/* market trade */}

          <div
            className={`text-center flex items-center py-1 justify-center ${marketTrade?.side === 'BUY' ? 'text-buyGreen' : 'text-sellRed'} text-lg`}
          >
            {marketTrade && marketTrade?.price}
          </div>

          {/* buy */}

          <section
            className='text-xs overflow-auto text-white'
            style={{
              height: '225px',
            }}
          >
            {orders?.bids.map((order, i) => {
              return (
                <div className='grid grid-cols-3 mr-2 py-1 hover:bg-symbolHover  justify-items-end' key={'orderbook-ask-' + i}>
                  <span className='text-buyGreen justify-self-start'>{order[0]}</span>

                  <span className=''>{order[1]}</span>

                  <span>{(order[1] * order[0]).toFixed(2)}</span>
                </div>
              );
            })}
          </section>
        </>
      )}
      {tab === 'recent' && <RecentTrade />}
    </div>
  );
}

export default OrderBook;
