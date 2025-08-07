import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest.ts";
import { getMovementsController } from "./movement.controller.ts";
import { getMovementsSchema } from "./movement.schema.ts";

const router = Router();

/**
 * @openapi
 * /api/movements/account/{accountId}:
 *   get:
 *     tags:
 *       - Movements
 *     summary: Get all movements for an account
 *     parameters:
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of movements
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movement'
 *       404:
 *         description: Account not found
 */
router.get(
	"/account/:accountId",
	validateRequest(getMovementsSchema),
	getMovementsController,
);

export default router;
