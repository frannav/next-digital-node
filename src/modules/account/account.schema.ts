import IBAN from "iban";
import { z } from "zod";

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateAccountInput:
 *       type: object
 *       required:
 *         - userId
 *         - IBAN
 *         - currency
 *         - initialBalance
 *       properties:
 *         userId:
 *           type: string
 *         IBAN:
 *           type: string
 *         currency:
 *           type: string
 *         initialBalance:
 *           type: number
 *     CreateAccountResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         userId:
 *           type: string
 *         IBAN:
 *           type: string
 *         currency:
 *           type: string
 *         balance:
 *           type: number
 *     Account:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         userId:
 *           type: string
 *         IBAN:
 *           type: string
 *         currency:
 *           type: string
 *         balance:
 *           type: number
 */

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
