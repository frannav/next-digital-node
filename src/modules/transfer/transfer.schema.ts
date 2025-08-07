import IBAN from "iban";
import { z } from "zod";

export const createTransferSchema = z.object({
	body: z.object({
		fromAccountId: z.string(),
		toIban: z.string().refine(IBAN.isValid, { message: "Invalid IBAN" }),
		amount: z.number().positive(),
	}),
});
