import IBAN from "iban";
import { z } from "zod";

export const createAccountSchema = z.object({
	body: z.object({
		userId: z.string(),
		IBAN: z.string().refine(IBAN.isValid, { message: "Invalid IBAN" }),
		currency: z.string(),
		initialBalance: z.number().positive(),
	}),
});

export const getAccountsByUserSchema = z.object({
	params: z.object({
		userId: z.string(),
	}),
});

export const getAccountByIdSchema = z.object({
	params: z.object({
		accountId: z.string(),
	}),
});
