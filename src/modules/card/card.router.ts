import { Router } from "express";
import {
	createCardController,
	getCardByIdController,
	activateCardController,
	changePinController,
} from "./card.controller.ts";
import { validateRequest } from "../../middleware/validateRequest.ts";
import {
	createCardSchema,
	getCardByIdSchema,
	activateCardSchema,
	changePinSchema,
} from "./card.schema.ts";

const router = Router();

router.post("/", validateRequest(createCardSchema), createCardController);
router.get(
	"/:cardId",
	validateRequest(getCardByIdSchema),
	getCardByIdController,
);
router.post(
	"/activate",
	validateRequest(activateCardSchema),
	activateCardController,
);
router.patch(
	"/:cardId/pin",
	validateRequest(changePinSchema),
	changePinController,
);

export default router;
