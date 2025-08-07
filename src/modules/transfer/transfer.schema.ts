import IBAN from "iban";
import { z } from "zod";

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateTransferInput:
 *       type: object
 *       required:
 *         - fromAccountId
 *         - toIban
 *         - amount
 *       properties:
 *         fromAccountId:
 *           type: string
 *         toIban:
 *           type: string
 *         amount:
 *           type: number
 */

export const createTransferSchema = z.object({
	body: z.object({
		fromAccountId: z.string(),
		toIban: z.string().refine(IBAN.isValid, { message: "Invalid IBAN" }),
		amount: z.number().positive(),
	}),
});
