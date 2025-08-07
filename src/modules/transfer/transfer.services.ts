import * as store from '../../adapters/local-store/store.ts';
import type { Account } from '../account/account.types.ts';
import type { Movement } from '../movement/movement.types.ts';

const TRANSFER_FEE = 0.5; // Example fee for external transfers

export const createTransfer = async (transferData: { fromAccountId: string; toIban: string; amount: number }) => {
  const { fromAccountId, toIban, amount } = transferData;

  const fromAccount: Account = await store.getById('accounts', fromAccountId);
  if (!fromAccount) {
    return { success: false, message: 'Source account not found' };
  }

  if (fromAccount.balance < amount) {
    return { success: false, message: 'Insufficient funds' };
  }

  const allAccounts: Account[] = await store.getAll('accounts');
  const toAccount: Account | undefined = allAccounts.find(acc => acc.IBAN === toIban);
  if (!toAccount) {
    return { success: false, message: 'Destination account not found' };
  }

  const isInternalTransfer = !!toAccount;
  const fee = isInternalTransfer ? 0 : TRANSFER_FEE;
  const totalAmount = amount + fee;

  if (fromAccount.balance < totalAmount) {
    return { success: false, message: 'Insufficient funds to cover transfer and fee' };
  }

  // Update source account balance
  const newFromBalance = fromAccount.balance - totalAmount;
  await store.updateItem('accounts', fromAccount.id, { balance: newFromBalance });

  // Create transfer-out movement
  const transferOutMovement: Movement = {
    id: `mov_${Date.now()}`,
    accountId: fromAccount.id,
    type: 'transfer-out',
    amount,
    date: new Date().toISOString(),
    description: `Transfer to ${toIban}`,
  };
  await store.createItem('movements', transferOutMovement);

  if (fee > 0) {
    const feeMovement: Movement = {
      id: `mov_${Date.now() + 1}`,
      accountId: fromAccount.id,
      type: 'fee',
      amount: fee,
      date: new Date().toISOString(),
      description: 'External transfer fee',
    };
    await store.createItem('movements', feeMovement);
  }

  if (isInternalTransfer) {
    // Update destination account balance
    const newToBalance = toAccount.balance + amount;
    await store.updateItem('accounts', toAccount.id, { balance: newToBalance });

    // Create transfer-in movement
    const transferInMovement: Movement = {
      id: `mov_${Date.now() + 2}`,
      accountId: toAccount.id,
      type: 'transfer-in',
      amount,
      date: new Date().toISOString(),
      description: `Transfer from ${fromAccount.IBAN}`,
    };
    await store.createItem('movements', transferInMovement);
  }

  return { success: true, message: 'Transfer processed successfully', newBalance: newFromBalance };
};


