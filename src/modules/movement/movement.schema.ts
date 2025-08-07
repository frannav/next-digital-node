import { z } from 'zod';

export const getMovementsSchema = z.object({
  params: z.object({
    accountId: z.string(),
  }),
});

