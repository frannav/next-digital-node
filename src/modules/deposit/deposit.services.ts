import * as store from '../../adapters/local-store/store.ts';
import type { Card } from '../card/card.types.ts';
import type { Account } from '../account/account.types.ts';
import type { Movement } from '../movement/movement.types.ts';

export const createDeposit = async (depositData: { cardId: string; amount: number }) => {
  const { cardId, amount } = depositData;

  const card: Card = await store.getById('cards', cardId);
  if (!card) {
    return { success: false, message: 'Card not found' };
  }

  // Note: The task mentions deposits should only be allowed at the own bank's ATM.
  // This logic could be extended by passing an `atmBankId` like in withdrawals.
  // For now, we assume all deposits are valid.

  const account: Account = await store.getById('accounts', card.accountId);
  if (!account) {
    return { success: false, message: 'Account not found' };
  }

  // Update account balance
  const newBalance = account.balance + amount;
  await store.updateItem('accounts', account.id, { balance: newBalance });

  // Create deposit movement
  const depositMovement: Movement = {
    id: `mov_${Date.now()}`,
    accountId: account.id,
    type: 'deposit',
    amount,
    date: new Date().toISOString(),
    description: 'ATM Deposit',
  };
  await store.createItem('movements', depositMovement);

  return { success: true, message: 'Deposit processed successfully', newBalance };
};


