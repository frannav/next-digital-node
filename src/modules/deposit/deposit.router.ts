import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest.ts";
import { createDepositController } from "./deposit.controller.ts";
import { createDepositSchema } from "./deposit.schema.ts";

const router: Router = Router();

router.post("/", validateRequest(createDepositSchema), createDepositController);

export default router;
