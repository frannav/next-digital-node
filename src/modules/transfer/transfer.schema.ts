import { z } from 'zod';
import IBAN from 'iban';

export const createTransferSchema = z.object({
  body: z.object({
    fromAccountId: z.string(),
    toIban: z.string().refine(IBAN.isValid, { message: 'Invalid IBAN' }),
    amount: z.number().positive(),
  }),
});


