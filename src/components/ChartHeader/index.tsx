import React, { useState, useEffect } from 'react';
import { useOrderlyContext } from '../../orderly/OrderlyContext';

import { parseSymbol } from '../RecentTrade';
import { nearMetadata, getFTmetadata } from '../../near';

import { IoArrowDownOutline, IoArrowUpOutline } from 'react-icons/io5';

function formatWithCommas(value: string): string {
  const pattern = /(-?\d+)(\d{3})/;
  while (pattern.test(value)) {
    value = value.replace(pattern, '$1,$2');
  }
  return value;
}

function ChartHeader() {
  const { symbol, setSymbol, tokenInfo, ticker } = useOrderlyContext();

  const { symbolFrom, symbolTo } = parseSymbol(symbol);

  const idFrom = tokenInfo && tokenInfo.find((t) => t.token === symbolFrom)?.token_account_id;

  const idTo = tokenInfo && tokenInfo.find((t) => t.token === symbolTo)?.token_account_id;

  const [iconIn, setIconIn] = useState<string>();

  const [iconOut, setIconOut] = useState<string>();

  useEffect(() => {
    if (!idFrom) return;

    if (idFrom === 'near') {
      setIconIn(nearMetadata.icon);
    } else {
      getFTmetadata(idFrom).then((res) => {
        setIconIn(res.icon);
      });
    }
  }, [idFrom]);

  useEffect(() => {
    if (!idTo) return;

    if (idTo === 'near') {
      setIconOut(nearMetadata.icon);
    } else {
      getFTmetadata(idTo).then((res) => {
        setIconOut(res.icon);
      });
    }
  }, [idTo]);

  const diff = ticker ? ((ticker.close - ticker.open) * 100) / ticker.open : 0;

  const disPlayDiff = Math.abs(diff) < 0.01 && Math.abs(diff) > 0 ? '<0.01' : Math.abs(diff).toFixed(2);

  return (
    <div className='flex items-center  text-white text-sm'>
      {/* icon */}
      <div className='flex items-center flex-shrink-0 '>
        {<img src={iconIn} alt='' className='rounded-full relative  h-6 w-6' />}

        {<img src={iconOut} alt='' className='rounded-full relative right-1 z-10 h-6 w-6' />}

        <span className='text-base ml-4'>
          {symbolFrom} / {symbolTo}
        </span>
      </div>

      {ticker && (
        <div className={`flex  items-center  justify-between text-primary`}>
          <div className='flex  ml-11 items-start flex-col'>
            <span>Price</span>
            <div className='flex items-center mt-0.5'>
              <span className='text-white font-bold'>{ticker.close}</span>

              <span
                className={`${
                  diff < 0 ? 'text-sellRed bg-sellRed' : diff > 0 ? 'text-buyGreen bg-buyGreen' : 'text-white'
                } bg-opacity-10 text-xs flex items-center  rounded-md ml-2 px-1 py-0.5`}
              >
                {' '}
                <span className='relative '>{diff > 0 ? <IoArrowUpOutline /> : diff < 0 ? <IoArrowDownOutline /> : null}</span>
                <span>{disPlayDiff}%</span>
              </span>
            </div>
          </div>

          <div className='flex  ml-11 items-start flex-col'>
            <span>High(24h)</span>

            <span className='text-white mt-0.5 font-bold'>{ticker.high}</span>
          </div>

          <div className='flex items-start  ml-11 flex-col'>
            <span>Low(24h)</span>

            <span className='text-white mt-0.5 font-bold'>{ticker.low}</span>
          </div>

          <div className='flex items-start  ml-11 flex-col'>
            <span>Volume(24h)</span>

            <span className='text-white mt-0.5 font-bold'>${formatWithCommas(ticker.volume.toString())}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChartHeader;
