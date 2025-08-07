import { z } from 'zod';

export const createWithdrawalSchema = z.object({
  body: z.object({
    cardId: z.string(),
    amount: z.number().positive(),
    atmBankId: z.string().optional(),
  }),
});

