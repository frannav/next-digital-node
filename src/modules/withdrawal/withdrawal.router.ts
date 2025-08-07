import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest.ts";
import { createWithdrawalController } from "./withdrawal.controller.ts";
import { createWithdrawalSchema } from "./withdrawal.schema.ts";

const router = Router();

/**
 * @openapi
 * /api/withdrawals:
 *   post:
 *     tags:
 *       - Withdrawals
 *     summary: Create a new withdrawal
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateWithdrawalInput'
 *     responses:
 *       201:
 *         description: Withdrawal created successfully
 *       400:
 *         description: Bad request
 */
router.post(
	"/",
	validateRequest(createWithdrawalSchema),
	createWithdrawalController,
);

export default router;
