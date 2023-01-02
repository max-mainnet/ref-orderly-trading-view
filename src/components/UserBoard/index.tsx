import React, { useState, useEffect } from 'react';
import { useOrderlyContext } from '../../orderly/OrderlyContext';
import { parseSymbol } from '../RecentTrade/index';
import { nearMetadata, getFTmetadata } from '../../near';
import { useWalletSelector } from '../../WalletSelectorContext';
import { registerOrderly, storageDeposit } from '../../orderly/api';
import { getAccountInformation, getCurrentHolding, createOrder } from '../../orderly/off-chain-api';
import { Holding, ClientInfo, TokenInfo } from '../../orderly/type';
import { BuyButton, SellButton } from './Button';
import './index.css';
import { FaMinus, FaPlus } from 'react-icons/fa';
function UserBoard() {
  const { symbol, setSymbol, tokenInfo, ticker, marketTrade, markPrices } = useOrderlyContext();
  console.log('markPrices: ', markPrices);

  const { accountId, modal, selector } = useWalletSelector();

  const { symbolFrom, symbolTo } = parseSymbol(symbol);

  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');

  const [orderType, setOrderType] = useState<'Market' | 'Limit'>('Limit');

  const [holdings, setHoldings] = useState<Holding[]>();

  const idFrom = tokenInfo && tokenInfo.find((t) => t.token === symbolFrom)?.token_account_id;

  const idTo = tokenInfo && tokenInfo.find((t) => t.token === symbolTo)?.token_account_id;

  const [iconIn, setIconIn] = useState<string>();

  const [iconOut, setIconOut] = useState<string>();

  const [inputValue, setInputValue] = useState<string>('1');

  const [limitPrice, setLimitPrice] = useState<string>(marketTrade ? marketTrade.price.toString() : '');

  const [userInfo, setUserInfo] = useState<ClientInfo>();

  const handleSignOut = async () => {
    const wallet = await selector.wallet();
    return wallet.signOut();
  };

  const [symbolsArr] = useState(['e', 'E', '+', '-']);

  useEffect(() => {
    if (!accountId) return;

    getAccountInformation({ accountId }).then((res) => {
      console.log('res: ', res);
      setUserInfo(res);
    });

    getCurrentHolding({ accountId }).then((res) => {
      setHoldings(res?.data?.holding);
    });
  }, [accountId]);

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

  const tokenInHolding = holdings && holdings.find((h) => h.token === symbolFrom)?.holding;

  const tokenOutHolding = holdings && holdings.find((h) => h.token === symbolTo)?.holding;

  const markPriceSymbol = markPrices && markPrices.find((m) => m.symbol === symbol);
  console.log('markPriceSymbol: ', markPriceSymbol);

  const fee =
    orderType === 'Limit'
      ? !userInfo || !limitPrice
        ? '-'
        : (userInfo.maker_fee_rate / 10000) * Number(limitPrice || 0) * Number(inputValue || 0)
      : !userInfo || !markPriceSymbol
      ? '-'
      : (userInfo.taker_fee_rate / 10000) * Number(markPriceSymbol.price || 0) * Number(inputValue || 0);

  const total =
    orderType === 'Limit'
      ? !limitPrice || !userInfo || fee === '-'
        ? '-'
        : Number(inputValue || 0) * Number(limitPrice || 0) - Number(fee)
      : !markPriceSymbol || !userInfo || fee === '-'
      ? '-'
      : Number(inputValue || 0) * Number(markPriceSymbol.price || 0) - Number(fee);

  const handleSubmit = () => {
    if (!accountId) return;
    if (orderType === 'Market') {
      createOrder({
        accountId,
        orderlyProps: {
          side: side,
          symbol: symbol,
          order_type: 'MARKET',
          order_quantity: Number(inputValue),
        },
      });
    } else if (orderType === 'Limit') {
      createOrder({
        accountId,
        orderlyProps: {
          side: side,
          symbol: symbol,
          order_price: Number(limitPrice),
          order_type: 'LIMIT',
          order_quantity: Number(inputValue),
        },
      });
    }
  };

  return (
    <div className='w-full p-6 flex flex-col bg-black bg-opacity-10'>
      <button
        onClick={() => {
          return accountId ? handleSignOut() : modal.show();
        }}
        className='text-center text-white'
      >
        {!!accountId ? accountId : 'Connect Wallet'}
      </button>

      <button
        onClick={async () => {
          if (!accountId) return;
          return await storageDeposit(accountId);
        }}
        type='button'
        className='ml-2 text-white'
      >
        storage deposit
      </button>

      <button
        onClick={async () => {
          if (!accountId) return;
          return await registerOrderly(accountId);
        }}
        type='button'
        className='ml-2 text-white'
      >
        register orderly
      </button>

      <div className='text-sm text-white mb-4 text-left'>Balance</div>

      <div className='flex items-center mb-5 text-white text-sm justify-between'>
        <div className='flex items-center'>
          <img src={iconIn} className='rounded-full w-6 h-6 mr-2' alt='' />
          <span>{symbolFrom}</span>
        </div>

        <div className='flex items-center'>
          <span>{tokenInHolding ? tokenInHolding.toFixed(2) : null}</span>
          <span className='text-primary text-xs ml-2.5'>Deposit</span>
        </div>
      </div>

      <div className='flex items-center text-white text-sm justify-between'>
        <div className='flex items-center'>
          <img src={iconOut} className='rounded-full w-6 h-6 mr-2' alt='' />
          <span>{symbolTo}</span>
        </div>

        <div className='flex items-center'>
          <span>{tokenOutHolding ? tokenOutHolding.toFixed(2) : null}</span>
          <span className='text-primary text-xs ml-2.5'>Deposit</span>
        </div>
      </div>

      {/* sell and buy button  */}
      <div className='flex items-center justify-center mt-7'>
        <BuyButton
          onClick={() => {
            setSide('BUY');
          }}
          select={side === 'BUY'}
        />

        <SellButton
          onClick={() => {
            setSide('SELL');
          }}
          select={side === 'SELL'}
        />
      </div>

      {/*  order type  */}
      <div className='flex items-center justify-between mt-6'>
        <span className='text-sm text-primary'>Order Type</span>

        <div className='flex items-center'>
          <button
            className={`flex px-4 py-2 mr-2 rounded-lg items-center justify-center ${orderType === 'Limit' ? 'bg-buyGradientGreen' : 'bg-orderTypeBg'}`}
            onClick={() => {
              setOrderType('Limit');
            }}
            style={{
              width: '80px',
            }}
          >
            <span className={`text-sm ${orderType === 'Limit' ? 'text-white' : 'text-boxBorder'} font-bold`}>Limit</span>
          </button>

          <button
            className={`flex px-4 py-2 items-center rounded-lg justify-center ${orderType === 'Market' ? 'bg-buyGradientGreen' : 'bg-orderTypeBg'}`}
            onClick={() => {
              setOrderType('Market');
            }}
            style={{
              width: '80px',
            }}
          >
            <span className={`text-sm ${orderType === 'Market' ? 'text-white' : 'text-boxBorder'} font-bold`}>Market</span>
          </button>
        </div>
      </div>

      {/* input box */}
      <div className='w-full text-primary mt-6 bg-black text-sm bg-opacity-10 rounded-xl border border-boxBorder p-3'>
        <div className='mb-2 text-left'>{side === 'BUY' ? 'Size(Amount to buy)' : 'Size(Amount to sell)'}</div>

        <div className='flex items-center mt-2'>
          <input
            autoFocus
            inputMode='decimal'
            className='text-white text-xl w-full'
            value={inputValue}
            type='number'
            step='any'
            min={0}
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
            onKeyDown={(e) => symbolsArr.includes(e.key) && e.preventDefault()}
          />

          <span className=''>{symbolFrom}</span>
        </div>
      </div>

      {orderType === 'Limit' && (
        <div className='w-full text-primary mt-3 text-sm bg-black bg-opacity-10 rounded-xl border border-boxBorder p-3'>
          <div className='flex items-center justify-between'>
            <span>{side === 'BUY' ? 'Buy Price' : 'Sell Price'}</span>

            <span>{symbolTo}</span>
          </div>

          <div className='flex items-center mt-3'>
            <span>
              <FaMinus></FaMinus>
            </span>
            <input
              type='number'
              step='any'
              min={0}
              className='text-white text-center text-xl w-full'
              value={limitPrice}
              onChange={(e) => {
                setLimitPrice(e.target.value);
              }}
              inputMode='decimal'
              onKeyDown={(e) => symbolsArr.includes(e.key) && e.preventDefault()}
            />
            <span>
              <FaPlus></FaPlus>
            </span>
          </div>
        </div>
      )}
      {orderType === 'Market' && (
        <div className='w-full rounded-xl border border-boxBorder p-3 mt-3 text-sm flex items-center justify-between'>
          <span className='text-primary'>{side === 'BUY' ? 'Buy Price' : 'Sell Price'}</span>

          <span className='text-white'>Market price</span>
        </div>
      )}

      <div className='mt-6 text-sm'>
        <div className='flex items-center justify-between'>
          <span className='text-primary'>Fee </span>
          <span className='text-white'>
            {fee !== '-' ? '~' : ''} {fee === '-' ? '-' : fee.toFixed(3)} {` ${symbolTo}`}
          </span>
        </div>

        <div className='flex items-center mt-4 justify-between'>
          <span className='text-primary'>Total </span>
          <span className='text-white'>
            {total === '-' ? '-' : total.toFixed(4)} {` ${symbolTo}`}
          </span>
        </div>
      </div>

      <button
        className={`rounded-lg ${
          side === 'BUY' ? 'bg-buyGradientGreen' : 'bg-sellGradientRed'
        } text-white py-2.5 mt-4 flex items-center justify-center text-base `}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleSubmit();
        }}
      >
        {side === 'BUY' ? `Buy` : 'Sell'}
        {` ${symbolFrom}`}
      </button>
    </div>
  );
}

export default UserBoard;
