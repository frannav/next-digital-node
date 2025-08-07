import { z } from "zod";

export const createDepositSchema = z.object({
	body: z.object({
		cardId: z.string(),
		amount: z.number().positive(),
	}),
});
