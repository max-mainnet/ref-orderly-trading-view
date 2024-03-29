import { map, distinctUntilChanged } from 'rxjs';
import { NetworkId, setupWalletSelector } from '@near-wallet-selector/core';
import type { WalletSelector, AccountState } from '@near-wallet-selector/core';
import { setupModal } from '@near-wallet-selector/modal-ui';
import type { WalletSelectorModal } from '@near-wallet-selector/modal-ui';
import { setupNearWallet } from '@near-wallet-selector/near-wallet';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';

import * as React from 'react';

import { useEffect, useState, useCallback } from 'react';
import getConfig from './config';
import '@near-wallet-selector/modal-ui/styles.css';
import { get_orderly_private_key_path, get_orderly_public_key_path, tradingKeyMap } from './orderly/utils';

const CONTRACT_ID = getConfig().ORDERLY_ASSET_MANAGER;
declare global {
  interface Window {
    selector: WalletSelector & {};
    modal: WalletSelectorModal;
    selectorAccountId?: string | null;
  }
}

interface WalletSelectorContextValue {
  selector: WalletSelector & { accountId?: string };
  modal: WalletSelectorModal;
  accounts?: Array<AccountState>;
  accountId: string | null;
}

const WalletSelectorContext = React.createContext<WalletSelectorContextValue | null>(null);

const WalletSelectorContextWindow = React.createContext<WalletSelectorContextValue | null>(null);

export const WalletSelectorContextProvider: React.FC<any> = ({ children }) => {
  const [selector, setSelector] = useState<WalletSelector | null>(null);
  const [modal, setModal] = useState<WalletSelectorModal | null>(null);
  const [accounts, setAccounts] = useState<Array<AccountState>>([]);

  const init = useCallback(async () => {
    const _selector = await setupWalletSelector({
      network: 'testnet',
      debug: true,
      modules: [setupNearWallet(), setupMyNearWallet()],
    });

    const _modal = setupModal(_selector, { contractId: CONTRACT_ID });
    const state = _selector.store.getState();
    setAccounts(state.accounts);

    window.selector = _selector;
    window.modal = _modal;

    setSelector(_selector);
    setModal(_modal);
  }, []);

  useEffect(() => {
    init().catch((err) => {
      console.error(err);
      alert('Failed to initialise wallet selector');
    });
  }, [init]);

  useEffect(() => {
    if (!selector) {
      return;
    }

    const subscription = selector.store.observable
      .pipe(
        map((state) => state.accounts),
        distinctUntilChanged()
      )
      .subscribe((nextAccounts) => {
        console.log('Accounts Update', nextAccounts);

        setAccounts(nextAccounts);
      });

    return () => subscription.unsubscribe();
  }, [selector]);

  if (!selector || !modal) {
    return null;
  }

  const accountId = accounts.find((account) => account.active)?.accountId || null;

  window.selectorAccountId = accountId;

  return (
    <WalletSelectorContext.Provider
      value={{
        selector,
        modal,
        accounts,
        accountId,
      }}
    >
      {children}
    </WalletSelectorContext.Provider>
  );
};

export const WalletSelectorContextWindowProvider: React.FC<any> = ({ children }) => {
  const [selector, setSelector] = useState<WalletSelector | null>(window.selector);
  const [modal, setModal] = useState<WalletSelectorModal | null>(window.modal);

  const [selectorAccountId, setSelectorAccountId] = useState<string | null>(window.selectorAccountId || null);

  Object.defineProperties(window, {
    selector: {
      configurable: true,
      set: (value) => {
        setSelector(value);
        return value;
      },
      get: () => {
        return selector;
      },
    },
    modal: {
      configurable: true,
      set: (value) => {
        setModal(value);

        return value;
      },
      get: () => {
        return modal;
      },
    },
    selectorAccountId: {
      configurable: true,
      set: (value) => {
        setSelectorAccountId(value);
        return value;
      },
      get: () => {
        return selectorAccountId;
      },
    },
  });

  if (!selector || !modal) {
    return null;
  }

  selector.on('signedOut', () => {
    const priTradingKeyPath = get_orderly_private_key_path();

    localStorage.removeItem(priTradingKeyPath);

    const pubTradingKeyPath = get_orderly_public_key_path();

    localStorage.removeItem(pubTradingKeyPath);

    tradingKeyMap.clear();
  });

  return (
    <WalletSelectorContextWindow.Provider
      value={{
        selector,
        modal,
        accountId: selectorAccountId,
      }}
    >
      {children}
    </WalletSelectorContextWindow.Provider>
  );
};

export function useWalletSelectorWindow() {
  const context = React.useContext(WalletSelectorContextWindow);

  if (!context) {
    throw new Error('useWalletSelector must be used within a WalletSelectorContextProvider');
  }

  return context;
}

export function useWalletSelector() {
  const context = React.useContext(WalletSelectorContext);

  if (!context) {
    throw new Error('useWalletSelector must be used within a WalletSelectorContextProvider');
  }

  return context;
}
