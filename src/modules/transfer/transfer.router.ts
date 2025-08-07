import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest.ts";
import { createTransferController } from "./transfer.controller.ts";
import { createTransferSchema } from "./transfer.schema.ts";

const router: Router = Router();

router.post(
	"/",
	validateRequest(createTransferSchema),
	createTransferController,
);

export default router;
