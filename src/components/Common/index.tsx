import React, { useCallback, useEffect, useState, useRef } from 'react';
import ReactTooltip from 'react-tooltip';
import { GrayBgBox, NearIcon, OrderStateOutline, ArrowCurve, OrderSmile, SpinIcon, CheckFlow, OrderStateOutlineBlack } from './Icons';
import { useTokenMetaFromSymbol } from '../ChartHeader/state';
import { useOrderlyContext } from '../../orderly/OrderlyContext';
import { parseFullSymbol } from '../../datafeed/helpers';
import { toast, ToastContainer } from 'react-toastify';
import { TokenMetadata } from '../../orderly/type';
import { parseSymbol } from '../RecentTrade';
import 'react-toastify/dist/ReactToastify.css';

import { HiDownload } from 'react-icons/hi';
import { formatTimeDate } from '../OrderBoard/index';

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
      className='text-base min-w-fit py-3 px-10 relative w-p240  bg-buyGradientGreen rounded-lg text-white font-bold flex items-center justify-center
      
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

export function ConfirmButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      className='text-base min-w-fit py-3 px-10 relative w-p240  bg-buyGradientGreen rounded-lg text-white font-bold flex items-center justify-center
      
    '
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
    >
      <span className='whitespace-nowrap ml-3  hover:bg-'>Confirm</span>
    </button>
  );
}

export function RegisterButton({
  onClick,
  storageEnough,
  spin,
  check,
}: {
  onClick: () => void;
  spin?: boolean;
  storageEnough: boolean;
  check: boolean;
}) {
  const [spinNow, setSpinNow] = useState<boolean>(!!spin);

  useEffect(() => {
    setSpinNow(!!spin);
  }, [spin]);

  return (
    <div className='flex flex-col items-center relative '>
      <button
        className={`text-base min-w-fit mb-5 py-3  px-10 relative w-p240 ${
          spinNow || !check ? 'opacity-30 cursor-not-allowed' : ''
        } bg-buyGradientGreen rounded-lg text-white font-bold flex items-center justify-center
      
    `}
        onClick={(e) => {
          e.stopPropagation();
          setSpinNow(true);
          onClick();
        }}
        type='button'
        disabled={spinNow || !check}
      >
        {spinNow && <SpinIcon />}
        <span className={`whitespace-nowrap ml-3  `}>Register</span>
      </button>
      <div className='flex items-start text-sm relative text-white flex-col'>
        <div className='relative mb-3 flex items-center'>
          <div className='mr-2'>
            <CheckFlow checked={!!storageEnough}></CheckFlow>
          </div>

          <div>Deposit storage fee</div>
        </div>

        <div className='relative flex mb-5 items-center'>
          <div className='mr-2'>
            <CheckFlow checked={false}></CheckFlow>
          </div>

          <div>Register Orderly Account</div>
        </div>

        <div
          className='w-4 transform rotate-90 absolute top-6'
          style={{
            border: '1px dashed #566069 ',
            left: '-2px',
          }}
        ></div>
      </div>
    </div>
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
  timeStamp,
}: {
  orderType: 'Limit' | 'Market';
  symbolName: string;
  side: 'Buy' | 'Sell';
  size: string;
  price: string;
  tokenIn: TokenMetadata | undefined;
  timeStamp?: number;
}) {
  const { symbolFrom, symbolTo } = parseSymbol(symbolName);
  return toast(
    <div className={`flex-col   text-sm text-dark5  `}>
      <FlexRowBetween className='relative bottom-3'>
        {/* <div className='flex -mt-1 items-center'>
          <TokenIcon src={tokenIn?.icon} />
          <span className='text-white  ml-2'>{symbolFrom}</span>
          <span> / {symbolTo}</span>
        </div> */}

        <div className='flex text-sm items-center'>
          <div className={`border border-dark5 rounded-lg font-bold px-2 mr-1.5  ${side === 'Buy' ? 'bg-greenLight' : 'bg-redLight'}`}>{side}</div>

          <div className='text-dark5 font-bold text-lg'>{orderType} Order Created!</div>
        </div>

        <div className='flex -mt-1 items-center'>
          <span>Open</span>
          <span className='ml-1'>
            <OrderStateOutlineBlack />
          </span>
        </div>
      </FlexRowBetween>

      <FlexRowStart className='mt-6 '>
        {`To ${side} `}
        <span className='mx-1 font-bold'>{`${size} ${symbolFrom}`}</span>
        at
        <span className='ml-1 font-bold'>{`${price} ${symbolTo}`}</span>
      </FlexRowStart>

      {timeStamp !== undefined && <div className='mt-2 pb-8 items-start text-start'>{formatTimeDate(timeStamp)}</div>}
    </div>,
    {
      closeOnClick: true,
      hideProgressBar: false,
      position: 'bottom-right',
      progress: undefined,
      autoClose: false,
      closeButton: false,
      style: {
        background: side === 'Buy' ? 'linear-gradient(180deg, #5EFFEC 0%, #9CFFE7 100%)' : 'linear-gradient(180deg, #FFA5DB 0%, #FFDCF1 100%)',
        boxShadow: '0px -5px 10px rgba(0, 0, 0, 0.25)',
        borderRadius: '16px',
        zIndex: 9999,
        right: '40px',
        width: '340px',
        bottom: '-70px',
      },
    }
  );
}

export function DepositButton(props: any) {
  return (
    <div
      className='relative  flex items-center justify-center text-white'
      style={{
        width: '92px',
      }}
      {...props}
    >
      <GrayBgBox className='absolute  cursor-pointer left-0 -bottom-0.5 z-10'></GrayBgBox>

      <div className='flex cursor-pointer items-center relative z-40 font-normal'>
        <span className='text-13px'>Deposit</span>

        <HiDownload className='ml-1' />
      </div>
    </div>
  );
}

export function WithdrawButton(props: any) {
  return (
    <div
      className='relative  flex items-center justify-center text-white'
      style={{
        width: '92px',
      }}
      {...props}
    >
      <GrayBgBox className='absolute  cursor-pointer transform rotate-180 left-0 -bottom-0.5 z-10'></GrayBgBox>

      <div className='flex  cursor-pointer items-center relative z-40 font-normal'>
        <span className='text-13px'>Withdraw</span>

        <ArrowCurve />
      </div>
    </div>
  );
}

export function MyOrderTip({
  price,
  quantity,
  scrollTagID,
}: {
  price: number;
  quantity: number;
  scrollTagID: 'buy-order-book-panel' | 'sell-order-book-panel';
}) {
  const [showDetail, setShowDetail] = useState(false);

  const id = `order-smile-${price}`;

  function getElementTop(element: any) {
    var actualTop = element.offsetTop;
    var current = element.offsetParent;

    while (current !== null) {
      actualTop += current.offsetTop;
      current = current.offsetParent;
    }

    return actualTop;
  }

  function getPosition() {
    const smileEl = document.getElementById(id);

    const orderEl = document.getElementById(scrollTagID);

    if (!smileEl || !orderEl) return;

    const top = getElementTop(smileEl);

    const scrollTop = orderEl.scrollTop;

    return {
      top: top - scrollTop + 20,
    };
  }

  return (
    <div
      className='relative text-sm z-40 text-primary'
      onMouseEnter={() => {
        setShowDetail(true);
      }}
      onMouseLeave={() => {
        setShowDetail(false);
      }}
      id={id}
    >
      <OrderSmile></OrderSmile>
      {showDetail && (
        <div
          className='fixed  z-50  rounded-md border bg-orderTipBg border-border3 p-2 '
          style={{
            width: '120px',
            ...getPosition(),
          }}
        >
          <div className='flex items-center justify-between'>
            <span>Price</span>

            <span className='text-white'>{price}</span>
          </div>

          <div className='flex items-center justify-between mt-2 '>
            <span>Open Qty.</span>

            <span className='text-white'>{quantity}</span>
          </div>
        </div>
      )}
    </div>
  );
}
