import * as store from '../../adapters/local-store/store.ts';
import { Movement } from './movement.types.ts';

export const getMovementsByAccountId = async (accountId: string): Promise<Movement[]> => {
  const allMovements = await store.getAll('movements');
  return allMovements.filter((mov) => mov.accountId === accountId);
};


