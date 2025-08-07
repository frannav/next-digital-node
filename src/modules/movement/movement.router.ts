import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest.ts";
import { getMovementsController } from "./movement.controller.ts";
import { getMovementsSchema } from "./movement.schema.ts";

const router = Router();

router.get(
	"/account/:accountId",
	validateRequest(getMovementsSchema),
	getMovementsController,
);

export default router;
