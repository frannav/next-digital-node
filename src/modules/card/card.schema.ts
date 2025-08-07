import { z } from "zod";

/**
 * @openapi
 * components:
 *   schemas:
 *     Card:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         accountId:
 *           type: string
 *         type:
 *           type: string
 *           enum: [debit, credit]
 *         creditLimit:
 *           type: number
 *         activated:
 *           type: boolean
 *     CreateCardInput:
 *       type: object
 *       required:
 *         - accountId
 *         - type
 *         - pin
 *       properties:
 *         accountId:
 *           type: string
 *         type:
 *           type: string
 *           enum: [debit, credit]
 *         pin:
 *           type: string
 *           format: password
 *           minLength: 4
 *           maxLength: 4
 *         creditLimit:
 *           type: number
 *     ActivateCardInput:
 *       type: object
 *       required:
 *         - cardId
 *         - pin
 *       properties:
 *         cardId:
 *           type: string
 *         pin:
 *           type: string
 *           format: password
 *           minLength: 4
 *           maxLength: 4
 *     ChangePinInput:
 *       type: object
 *       required:
 *         - oldPin
 *         - newPin
 *       properties:
 *         oldPin:
 *           type: string
 *           format: password
 *           minLength: 4
 *           maxLength: 4
 *         newPin:
 *           type: string
 *           format: password
 *           minLength: 4
 *           maxLength: 4
 */

export const createCardSchema = z.object({
	body: z.object({
		accountId: z.string(),
		type: z.enum(["debit", "credit"]),
		pin: z.string().length(4, { message: "PIN must be 4 digits" }),
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
		pin: z.string().length(4, { message: "PIN must be 4 digits" }),
	}),
});

export const changePinSchema = z.object({
	params: z.object({
		cardId: z.string(),
	}),
	body: z.object({
		oldPin: z.string().length(4, { message: "Old PIN must be 4 digits" }),
		newPin: z.string().length(4, { message: "New PIN must be 4 digits" }),
	}),
});
