import { z } from "zod";

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateWithdrawalInput:
 *       type: object
 *       required:
 *         - cardId
 *         - amount
 *       properties:
 *         cardId:
 *           type: string
 *         amount:
 *           type: number
 *         atmBankId:
 *           type: string
 */

export const createWithdrawalSchema = z.object({
	body: z.object({
		cardId: z.string(),
		amount: z.number().positive(),
		atmBankId: z.string().optional(),
	}),
});
