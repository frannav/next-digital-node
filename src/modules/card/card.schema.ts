import { z } from 'zod';

export const createCardSchema = z.object({
  body: z.object({
    accountId: z.string(),
    type: z.enum(['debit', 'credit']),
    pin: z.string().length(4, { message: 'PIN must be 4 digits' }),
    creditLimit: z.number().optional(),
  }),
});

export const getCardByIdSchema = z.object({
  params: z.object({
    cardId: z.string(),
  }),
});

export const activateCardSchema = z.object({
  body: z.object({
    cardId: z.string(),
    pin: z.string().length(4, { message: 'PIN must be 4 digits' }),
  }),
});

export const changePinSchema = z.object({
  params: z.object({
    cardId: z.string(),
  }),
  body: z.object({
    oldPin: z.string().length(4, { message: 'Old PIN must be 4 digits' }),
    newPin: z.string().length(4, { message: 'New PIN must be 4 digits' }),
  }),
});

