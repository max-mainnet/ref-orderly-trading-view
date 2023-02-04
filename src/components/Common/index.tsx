import React, { useCallback, useEffect, useState } from 'react';
import ReactTooltip from 'react-tooltip';
import { NearIcon, OrderStateOutline } from './Icons';
import { useTokenMetaFromSymbol } from '../ChartHeader/state';
import { useOrderlyContext } from '../../orderly/OrderlyContext';
import { parseFullSymbol } from '../../datafeed/helpers';
import { toast, ToastContainer } from 'react-toastify';
import { TokenMetadata } from '../../orderly/type';
import { parseSymbol } from '../RecentTrade';
import 'react-toastify/dist/ReactToastify.css';

export function TokenIcon({ src }: { src: any }) {
  return <img src={src} alt='' className={`h-5 w-5 rounded-full `} />;
}

export function QuestionMark(props: { color?: 'bright' | 'dark'; colorhex?: string; className?: string }) {
  const { color, colorhex } = props;

  const [status, setStatus] = useState(false);
  return (
    <label
      {...props}
      onMouseOver={() => {
        setStatus(true);
      }}
      onMouseLeave={() => {
        setStatus(false);
      }}
    >
      {status || color === 'bright' ? (
        <svg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <path
            d='M5.4375 9.19141C5.4375 9.50207 5.68934 9.75391 6 9.75391C6.31066 9.75391 6.5625 9.50207 6.5625 9.19141C6.5625 8.88074 6.31066 8.62891 6 8.62891C5.68934 8.62891 5.4375 8.88074 5.4375 9.19141Z'
            fill='white'
          />
          <path
            d='M6 11.25C3.105 11.25 0.75 8.895 0.75 6C0.75 3.105 3.105 0.75 6 0.75C8.895 0.75 11.25 3.105 11.25 6C11.25 8.895 8.895 11.25 6 11.25ZM6 1.50336C3.5205 1.50336 1.50336 3.5205 1.50336 6C1.50336 8.47913 3.5205 10.4966 6 10.4966C8.47913 10.4966 10.4966 8.47914 10.4966 6C10.4966 3.5205 8.47913 1.50336 6 1.50336Z'
            fill='white'
          />
          <path
            d='M6 7.89466C5.79299 7.89466 5.625 7.72666 5.625 7.51967V6.88554C5.625 6.27203 6.09374 5.8033 6.50774 5.38967C6.8111 5.08592 7.12499 4.77242 7.12499 4.5223C7.12499 3.89717 6.62024 3.38867 6 3.38867C5.36926 3.38867 4.875 3.87542 4.875 4.4968C4.875 4.7038 4.70701 4.87178 4.5 4.87178C4.29299 4.87178 4.125 4.70378 4.125 4.49678C4.125 3.4723 4.9661 2.63867 6 2.63867C7.0339 2.63867 7.875 3.48355 7.875 4.5223C7.875 5.08367 7.44937 5.50891 7.038 5.9203C6.71175 6.2458 6.37501 6.58255 6.37501 6.88516V7.51928C6.37501 7.72629 6.20701 7.89466 6 7.89466Z'
            fill='white'
          />
        </svg>
      ) : (
        <svg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <path
            d='M5.4375 9.19141C5.4375 9.50207 5.68934 9.75391 6 9.75391C6.31066 9.75391 6.5625 9.50207 6.5625 9.19141C6.5625 8.88074 6.31066 8.62891 6 8.62891C5.68934 8.62891 5.4375 8.88074 5.4375 9.19141Z'
            fill={colorhex || '#7E8A93'}
          />
          <path
            d='M6 11.25C3.105 11.25 0.75 8.895 0.75 6C0.75 3.105 3.105 0.75 6 0.75C8.895 0.75 11.25 3.105 11.25 6C11.25 8.895 8.895 11.25 6 11.25ZM6 1.50336C3.5205 1.50336 1.50336 3.5205 1.50336 6C1.50336 8.47913 3.5205 10.4966 6 10.4966C8.47913 10.4966 10.4966 8.47914 10.4966 6C10.4966 3.5205 8.47913 1.50336 6 1.50336Z'
            fill={colorhex || '#7E8A93'}
          />
          <path
            d='M6 7.89466C5.79299 7.89466 5.625 7.72666 5.625 7.51967V6.88554C5.625 6.27203 6.09374 5.8033 6.50774 5.38967C6.8111 5.08592 7.12499 4.77242 7.12499 4.5223C7.12499 3.89717 6.62024 3.38867 6 3.38867C5.36926 3.38867 4.875 3.87542 4.875 4.4968C4.875 4.7038 4.70701 4.87178 4.5 4.87178C4.29299 4.87178 4.125 4.70378 4.125 4.49678C4.125 3.4723 4.9661 2.63867 6 2.63867C7.0339 2.63867 7.875 3.48355 7.875 4.5223C7.875 5.08367 7.44937 5.50891 7.038 5.9203C6.71175 6.2458 6.37501 6.58255 6.37501 6.88516V7.51928C6.37501 7.72629 6.20701 7.89466 6 7.89466Z'
            fill={colorhex || '#7E8A93'}
          />
        </svg>
      )}
    </label>
  );
}

export function CheckBox({ check, setCheck }: { check: boolean; setCheck: () => void }) {
  return (
    <div
      className='w-3 h-3 rounded-full  flex items-center justify-center cursor-pointer'
      style={{
        border: '1px solid rgba(0, 198, 162, 0.5)',
        height: '13px',
        width: '13px',
      }}
      onClick={() => {
        setCheck();
      }}
    >
      {check && (
        <div
          className=' rounded-full '
          style={{
            height: '9px',
            width: '9px',
            background: '#00D6AF',
          }}
        ></div>
      )}
    </div>
  );
}

export function TipWrapper(props: { tipText: string; id: string }) {
  const { tipText, id } = props;

  function getTip() {
    return `<div class=" rounded-md w-p200 text-primary  text-xs  text-left">
    ${tipText} 
  </div>`;
  }

  return (
    <div data-class='reactTip' data-for={id} data-html={true} data-place={'top'} data-tip={getTip()}>
      <QuestionMark></QuestionMark>

      <ReactTooltip id={id} backgroundColor='#1D2932' place='right' border borderColor='#7e8a93' textColor='#C6D1DA' effect='solid' />
    </div>
  );
}

export function ErrorTip({ text }: { text: string }) {
  return (
    <div className='bg-errorTip rounded overflow-hidden text-sm px-6 py-3 '>
      <div className='absolute w-1 bg-sellRed h-full left-0'></div>

      <span className='text-textRed'>{text}</span>
    </div>
  );
}

export function ConnectWallet({ onClick }: { onClick: () => void }) {
  return (
    <button
      className='text-base min-w-fit py-3 px-10 absolute  top-1/3 bg-buyGradientGreen rounded-lg text-white font-bold flex items-center justify-center
    
      
    '
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
    >
      <NearIcon />

      <span className='whitespace-nowrap ml-3  hover:bg-'>Connect Wallet</span>
    </button>
  );
}

export function FlexRowBetween({ className, children }: { children: React.ReactNode; className?: string }) {
  return <div className={`flex justify-between ${className} mt-2 items-center`}>{children}</div>;
}

export function FlexRow({ onClick, children, className }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div
      className={`flex items-center   ${className}`}
      onClick={() => {
        onClick && onClick();
      }}
    >
      {children}
    </div>
  );
}

export function FlexRowStart({ onClick, children, className }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div
      className={`flex items-start   ${className}`}
      onClick={() => {
        onClick && onClick();
      }}
    >
      {children}
    </div>
  );
}
export function orderPopUp({
  orderType,
  side,
  symbolName,
  price,
  size,
  tokenIn,
}: {
  orderType: 'Limit' | 'Market';
  symbolName: string;
  side: 'Buy' | 'Sell';
  size: string;
  price: string;
  tokenIn: TokenMetadata | undefined;
}) {
  const { symbolFrom, symbolTo } = parseSymbol(symbolName);
  return toast(
    <div className='flex-col bg-darkBg  text-sm text-primary  '>
      <FlexRowBetween>
        <div className='flex -mt-1 items-center'>
          <TokenIcon src={tokenIn?.icon} />
          <span className='text-white  ml-2'>{symbolFrom}</span>
          <span>/ {symbolTo}</span>
        </div>

        <div className='flex -mt-1 items-center'>
          <span>Open</span>
          <span className='ml-2'>
            <OrderStateOutline />
          </span>
        </div>
      </FlexRowBetween>

      <FlexRowBetween>
        <span>
          {orderType}
          &nbsp; Order
        </span>

        <span
          className={` bg-opacity-10 rounded-md px-2 flex items-center justify-between
        
          ${side === 'Buy' ? 'text-buyGreen bg-buyGreen' : 'text-sellRed bg-sellRed'}
        
        `}
        >
          {side}
        </span>
      </FlexRowBetween>

      <FlexRowBetween>
        <span>Size</span>

        <div className='flex items-center'>
          <span>{size}</span>

          <span className='ml-2'>{symbolFrom}</span>
        </div>
      </FlexRowBetween>

      <FlexRowBetween>
        <span>Price</span>

        <span>${price}</span>
      </FlexRowBetween>
    </div>,
    {
      closeOnClick: true,
      hideProgressBar: false,
      position: 'bottom-right',
      progress: undefined,
      autoClose: false,
      closeButton: false,
      style: {
        background: '#222F38',
        boxShadow: '0px 0px 10px 10px rgba(0, 0, 0, 0.15)',
        borderRadius: '16px',
        zIndex: 9999,
        border: '1px solid #304352',
      },
    }
  );
}
