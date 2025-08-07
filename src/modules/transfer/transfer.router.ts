import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest.ts";
import { createTransferController } from "./transfer.controller.ts";
import { createTransferSchema } from "./transfer.schema.ts";

const router: Router = Router();

/**
 * @openapi
 * /api/transfers:
 *   post:
 *     tags:
 *       - Transfers
 *     summary: Create a new transfer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTransferInput'
 *     responses:
 *       201:
 *         description: Transfer created successfully
 *       400:
 *         description: Bad request
 */
router.post(
	"/",
	validateRequest(createTransferSchema),
	createTransferController,
);

export default router;
