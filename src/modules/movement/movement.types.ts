export type MovementType = 'deposit' | 'withdrawal' | 'transfer-in' | 'transfer-out' | 'fee';

export interface Movement {
  id: string;
  accountId: string;
  type: MovementType;
  amount: number;
  date: string; // ISO 8601 format
  description?: string;
}

