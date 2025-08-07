import { z } from "zod";

/**
 * @openapi
 * components:
 *   schemas:
 *     Movement:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         accountId:
 *           type: string
 *         type:
 *           type: string
 *           enum: [deposit, withdrawal, transfer-in, transfer-out, fee]
 *         amount:
 *           type: number
 *         date:
 *           type: string
 *           format: date-time
 *         description:
 *           type: string
 */

export const getMovementsSchema = z.object({
	params: z.object({
		accountId: z.string(),
	}),
});
