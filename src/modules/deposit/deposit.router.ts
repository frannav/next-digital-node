import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest.ts";
import { createDepositController } from "./deposit.controller.ts";
import { createDepositSchema } from "./deposit.schema.ts";

const router: Router = Router();

/**
 * @openapi
 * /api/deposits:
 *   post:
 *     tags:
 *       - Deposits
 *     summary: Create a new deposit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDepositInput'
 *     responses:
 *       201:
 *         description: Deposit created successfully
 *       400:
 *         description: Bad request
 */
router.post("/", validateRequest(createDepositSchema), createDepositController);

export default router;
