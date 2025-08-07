import * as store from '../../adapters/local-store/store.ts';
import type { Account } from './account.types.ts';

export const createAccount = async (accountData: Omit<Account, 'id' | 'balance'> & { initialBalance: number }): Promise<Account> => {
  const newAccount: Account = {
    id: `acc_${Date.now()}`,
    userId: accountData.userId,
    IBAN: accountData.IBAN,
    currency: accountData.currency,
    balance: accountData.initialBalance,
  };

  return store.createItem('accounts', newAccount);
};

export const getAccountsByUserId = async (userId: string): Promise<Account[]> => {
  const allAccounts = await store.getAll('accounts');
  return allAccounts.filter((acc: Account) => acc.userId === userId);
};

export const getAccountById = async (accountId: string): Promise<Account | undefined> => {
  return store.getById('accounts', accountId);
};


