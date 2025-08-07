import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest.ts";
import { createWithdrawalController } from "./withdrawal.controller.ts";
import { createWithdrawalSchema } from "./withdrawal.schema.ts";

const router = Router();

router.post(
	"/",
	validateRequest(createWithdrawalSchema),
	createWithdrawalController,
);

export default router;
