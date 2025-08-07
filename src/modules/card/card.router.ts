import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest.ts";
import {
	activateCardController,
	changePinController,
	createCardController,
	getCardByIdController,
} from "./card.controller.ts";
import {
	activateCardSchema,
	changePinSchema,
	createCardSchema,
	getCardByIdSchema,
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
