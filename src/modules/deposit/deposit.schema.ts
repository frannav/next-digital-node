import { z } from "zod";

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateDepositInput:
 *       type: object
 *       required:
 *         - cardId
 *         - amount
 *       properties:
 *         cardId:
 *           type: string
 *         amount:
 *           type: number
 */

export const createDepositSchema = z.object({
	body: z.object({
		cardId: z.string(),
		amount: z.number().positive(),
	}),
});
