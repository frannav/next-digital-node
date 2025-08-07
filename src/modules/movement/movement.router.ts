import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest.ts";
import { getMovementsController } from "./movement.controller.ts";
import { getMovementsSchema } from "./movement.schema.ts";

const router = Router();

// This route is nested under accounts, so the full path will be /api/accounts/:accountId/movements
router.get("/", validateRequest(getMovementsSchema), getMovementsController);

export default router;
