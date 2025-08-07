import * as store from '../../adapters/local-store/store.ts';
import { Card } from '../card/card.types.ts';
import { Account } from '../account/account.types.ts';
import { Movement } from '../movement/movement.types.ts';

const OWN_BANK_ID = 'our-bank'; // Example bank ID
const WITHDRAWAL_FEE = 1.5; // Example fee

export const createWithdrawal = async (withdrawalData: { cardId: string; amount: number; atmBankId?: string }) => {
  const { cardId, amount, atmBankId } = withdrawalData;

  const card: Card = await store.getById('cards', cardId);
  if (!card) {
    return { success: false, message: 'Card not found' };
  }

  if (!card.activated) {
    return { success: false, message: 'Card is not activated' };
  }

  const account: Account = await store.getById('accounts', card.accountId);
  if (!account) {
    return { success: false, message: 'Account not found' };
  }

  const fee = atmBankId && atmBankId !== OWN_BANK_ID ? WITHDRAWAL_FEE : 0;
  const totalAmount = amount + fee;

  if (card.type === 'debit' && account.balance < totalAmount) {
    return { success: false, message: 'Insufficient funds' };
  }

  if (card.type === 'credit' && account.balance + (card.creditLimit || 0) < totalAmount) {
    return { success: false, message: 'Credit limit exceeded' };
  }

  // Update account balance
  const newBalance = account.balance - totalAmount;
  await store.updateItem('accounts', account.id, { balance: newBalance });

  // Create withdrawal movement
  const withdrawalMovement: Movement = {
    id: `mov_${Date.now()}`,
    accountId: account.id,
    type: 'withdrawal',
    amount,
    date: new Date().toISOString(),
    description: 'ATM Withdrawal',
  };
  await store.createItem('movements', withdrawalMovement);

  // Create fee movement if applicable
  if (fee > 0) {
    const feeMovement: Movement = {
      id: `mov_${Date.now() + 1}`,
      accountId: account.id,
      type: 'fee',
      amount: fee,
      date: new Date().toISOString(),
      description: 'Withdrawal fee for external ATM',
    };
    await store.createItem('movements', feeMovement);
  }

  return { success: true, message: 'Withdrawal processed successfully', newBalance };
};


