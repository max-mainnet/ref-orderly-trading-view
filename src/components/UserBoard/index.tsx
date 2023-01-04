import React, { useState, useEffect, useRef } from 'react';
import { useOrderlyContext } from '../../orderly/OrderlyContext';
import { parseSymbol } from '../RecentTrade/index';
import {
  nearMetadata,
  getFTmetadata,
  orderlyViewFunction,
  ftGetBalance,
  toPrecision,
  percent,
  scientificNotationToString,
  percentOfBigNumber,
} from '../../near';
import { useWalletSelector } from '../../WalletSelectorContext';
import { depositFT, depositOrderly, registerOrderly, storageDeposit, withdrawOrderly } from '../../orderly/api';
import { getAccountInformation, getCurrentHolding, createOrder } from '../../orderly/off-chain-api';
import { Holding, ClientInfo, TokenInfo } from '../../orderly/type';
import { BuyButton, SellButton } from './Button';
import './index.css';
import { FaMinus, FaPlus } from 'react-icons/fa';
import Modal from 'react-modal';
import Big from 'big.js';
import { IoClose } from 'react-icons/io5';
import { toReadableNumber } from '../../orderly/utils';
import { user_request_withdraw } from '../../orderly/on-chain-api';

Modal.defaultStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 100,
    backdropFilter: 'blur(15px)',
    WebkitBackdropFilter: 'blur(15px)',
  },
  content: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -65%)',
  },
};

const symbolsArr = ['e', 'E', '+', '-'];

function UserBoard() {
  const { symbol, setSymbol, tokenInfo, ticker, marketTrade, markPrices, balances } = useOrderlyContext();
  console.log('tokenInfo: ', tokenInfo);

  const { accountId, modal, selector } = useWalletSelector();

  const [operationType, setOperationType] = useState<'deposit' | 'withdraw'>();

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

  const inputLimitPriceRef = useRef<HTMLInputElement>(null);

  const inputAmountRef = useRef<HTMLInputElement>(null);

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

  const tokenInHolding = (balances && balances[symbolFrom]?.holding) || (holdings && holdings.find((h) => h.token === symbolFrom)?.holding);

  const tokenOutHolding = (balances && balances[symbolTo]?.holding) || (holdings && holdings.find((h) => h.token === symbolTo)?.holding);

  const markPriceSymbol = markPrices && markPrices.find((m) => m.symbol === symbol);

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
        className='text-center text-white'
        onClick={() => {
          setOperationType('deposit');
        }}
      >
        deposit
      </button>

      <button
        className='text-center text-white'
        onClick={() => {
          setOperationType('withdraw');
        }}
      >
        withdraw
      </button>
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
            ref={inputAmountRef}
            onWheel={(e) => (inputAmountRef.current ? inputAmountRef.current.blur() : null)}
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
            <span
              className='cursor-pointer'
              onClick={() => {
                setLimitPrice(Number(limitPrice) >= 1 ? (Number(limitPrice) - 1).toString() : limitPrice);
              }}
            >
              <FaMinus></FaMinus>
            </span>
            <input
              type='number'
              step='any'
              ref={inputLimitPriceRef}
              onWheel={(e) => (inputLimitPriceRef.current ? inputLimitPriceRef.current?.blur() : null)}
              min={0}
              className='text-white text-center text-xl w-full'
              value={limitPrice}
              onChange={(e) => {
                setLimitPrice(e.target.value);
              }}
              inputMode='decimal'
              onKeyDown={(e) => symbolsArr.includes(e.key) && e.preventDefault()}
            />
            <span
              className='cursor-pointer'
              onClick={() => {
                setLimitPrice((Number(limitPrice) + 1).toString());
              }}
            >
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

      <AssetManagerModal
        isOpen={operationType === 'deposit'}
        onRequestClose={() => {
          setOperationType(undefined);
        }}
        type={operationType}
        onClick={(amount: string) => {
          if (!idFrom) return;
          return depositOrderly(idFrom, amount);
        }}
        tokenId={idFrom}
        accountBalance={tokenInHolding || 0}
      />

      <AssetManagerModal
        isOpen={operationType === 'withdraw'}
        onRequestClose={() => {
          setOperationType(undefined);
        }}
        type={operationType}
        onClick={(amount: string) => {
          if (!idFrom) return;
          return withdrawOrderly(idFrom, amount);
        }}
        tokenId={idFrom}
        accountBalance={tokenInHolding || 0}
      />
    </div>
  );
}

function AssetManagerModal(
  props: Modal.Props & {
    type: 'deposit' | 'withdraw' | undefined;
    onClick: (amount: string) => void;
    tokenId: string | undefined;
    accountBalance: number;
  }
) {
  const { onClick, isOpen, onRequestClose, type, tokenId, accountBalance } = props;

  const [walletBalance, setWalletBalance] = useState<string>('');

  const [tokenMeta, setTokenMeta] = useState<any>();

  const [percentage, setPercentage] = useState<string>('0');

  const progressBarIndex = [0, 25, 50, 75, 100];

  useEffect(() => {
    if (!tokenId) return;
    if (tokenId === 'near') {
      setTokenMeta(nearMetadata);
    } else
      getFTmetadata(tokenId).then((meta) => {
        setTokenMeta(meta);
      });
  }, [tokenId]);

  useEffect(() => {
    if (!tokenId || !tokenMeta) return;
    ftGetBalance(tokenId).then((balance) => {
      setWalletBalance(toReadableNumber(tokenMeta.decimals, balance));
    });
  }, [tokenId, tokenMeta]);

  const [inputValue, setInputValue] = useState<string>();
  const ref = useRef<HTMLInputElement>(null);

  const rangeRef = useRef<HTMLInputElement>(null);

  const setAmountByShareFromBar = (sharePercent: string) => {
    setPercentage(sharePercent);

    const sharePercentOfValue = percentOfBigNumber(Number(sharePercent), type === 'deposit' ? walletBalance : accountBalance.toString(), tokenMeta.decimals);

    setInputValue(sharePercentOfValue);
  };

  useEffect(() => {
    if (rangeRef.current) {
      rangeRef.current.style.backgroundSize = `${percentage}% 100%`;
    }
  }, [percentage, rangeRef.current]);

  if (!tokenId || !tokenMeta) return null;

  function validation() {
    if (type === 'deposit') {
      if (tokenId === 'near' && new Big(walletBalance ?? 0).minus(new Big(inputValue ?? '0')).lt(0.25)) {
        return false;
      }

      if (tokenId !== 'near' && new Big(walletBalance ?? 0).minus(new Big(inputValue ?? '0')).lt(0)) {
        return false;
      }
    }

    if (type === 'withdraw') {
      if (new Big(accountBalance ?? 0).minus(new Big(inputValue ?? '0')).lt(0)) {
        return false;
      }
    }

    return true;
  }

  return (
    <Modal {...props}>
      <div className=' rounded-2xl lg:w-96 xs:w-95vw gradientBorderWrapperNoShadow bg-boxBorder text-sm text-primary border '>
        <div className='px-5 py-6 flex flex-col '>
          <div className='flex items-center pb-6 justify-between'>
            <span className='text-white text-lg font-bold'>{props.type === 'deposit' ? 'Deposit' : props.type === 'withdraw' ? 'Withdraw' : ''}</span>

            <span
              className='cursor-pointer '
              onClick={(e: any) => {
                onRequestClose && onRequestClose(e);
              }}
            >
              <IoClose size={20} />
            </span>
          </div>

          <div className='flex items-center pb-3 justify-between'>
            <span>Wallet Balance</span>

            <span>{!walletBalance ? '-' : toPrecision(walletBalance || '0', 3)}</span>
          </div>

          <div className='flex items-center pb-4 justify-between'>
            <span>Account Balance</span>

            <span>{accountBalance.toFixed(3)}</span>
          </div>

          <div className='flex mb-5 items-center border border-border2 w-full bg-black bg-opacity-10 rounded-2xl px-3 py-3'>
            <input
              inputMode='decimal'
              ref={ref}
              onWheel={(e) => (ref.current ? ref.current.blur() : null)}
              className='text-white text-xl w-full'
              value={inputValue}
              type='number'
              step='any'
              min={0}
              onChange={(e) => {
                const value = e.target.value;
                setInputValue(e.target.value);

                const percentage =
                  Number(type === 'deposit' ? walletBalance : accountBalance) > 0
                    ? percent(value || '0', type === 'deposit' ? walletBalance : accountBalance.toString()).toString()
                    : '0';
                setPercentage(scientificNotationToString(percentage));
              }}
              onKeyDown={(e) => symbolsArr.includes(e.key) && e.preventDefault()}
            />

            <div
              className='rounded-3xl p-1 flex flex-shrink-0 pr-2 items-center'
              style={{
                background: 'rgba(126, 138, 147, 0.1)',
              }}
            >
              <img src={tokenMeta.icon} className='rounded-full w-6 h-6 mr-2' alt='' />
              <span className='text-white font-bold text-base'>{tokenMeta.symbol}</span>
            </div>
          </div>

          <div className='pb-8'>
            <div className='flex items-center justify-between  px-1.5 '>
              {progressBarIndex.map((index, i) => {
                return (
                  <div
                    className='flex flex-col items-center text-xs cursor-pointer w-4'
                    key={i}
                    onClick={() => {
                      setAmountByShareFromBar(index.toString());
                    }}
                  >
                    <span>{index}%</span>
                    <span>∣</span>
                  </div>
                );
              })}
            </div>

            <div className='py-1 px-1 relative'>
              <input
                ref={rangeRef}
                onChange={(e) => {
                  setAmountByShareFromBar(e.target.value);
                }}
                value={percentage}
                type='range'
                className={`w-full cursor-pointer ${type + '-bar'} remove-by-share-bar`}
                min='0'
                max='100'
                step='any'
                inputMode='decimal'
                style={{
                  backgroundSize: `${percentage}% 100%`,
                }}
              />

              <div
                className='rangeText rounded-lg absolute py-0.5 text-xs text-center w-10'
                style={{
                  background: 'rgba(126, 138, 147, 0.1)',
                  left: `calc(${percentage}% - 40px * ${percentage} / 100)`,
                  //   transform: `translateX(-${Number(percentage)}%)`,
                  position: 'absolute',
                  top: '20px',
                }}
              >
                {Math.floor(Number(percentage))}%
              </div>
            </div>
          </div>
          {type === 'deposit' && !validation() && <div className='text-warn mb-2'>0.25 NEAR locked in wallet for covering transaction fee</div>}

          <button
            className={`flex ${
              !validation() ? 'opacity-70 cursor-not-allowed' : ''
            } items-center justify-center  font-bold text-base text-white py-2.5 rounded-lg ${type === 'deposit' ? 'bg-primaryGradient' : 'bg-withdrawPurple'}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!inputValue) return;
              onClick(inputValue);
            }}
            disabled={!validation()}
          >
            {type === 'deposit' ? 'Deposit' : type === 'withdraw' ? 'Withdraw' : ''}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default UserBoard;
