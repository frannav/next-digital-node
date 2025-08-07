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

/**
 * @openapi
 * /api/cards:
 *   post:
 *     tags:
 *       - Cards
 *     summary: Create a new card
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCardInput'
 *     responses:
 *       201:
 *         description: Card created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Card'
 *       400:
 *         description: Bad request
 */
router.post("/", validateRequest(createCardSchema), createCardController);

/**
 * @openapi
 * /api/cards/{cardId}:
 *   get:
 *     tags:
 *       - Cards
 *     summary: Get a card by its ID
 *     parameters:
 *       - in: path
 *         name: cardId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Card details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Card'
 *       404:
 *         description: Card not found
 */
router.get(
	"/:cardId",
	validateRequest(getCardByIdSchema),
	getCardByIdController,
);

/**
 * @openapi
 * /api/cards/activate:
 *   post:
 *     tags:
 *       - Cards
 *     summary: Activate a card
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ActivateCardInput'
 *     responses:
 *       200:
 *         description: Card activated successfully
 *       400:
 *         description: Bad request or card already active
 */
router.post(
	"/activate",
	validateRequest(activateCardSchema),
	activateCardController,
);

/**
 * @openapi
 * /api/cards/{cardId}/pin:
 *   patch:
 *     tags:
 *       - Cards
 *     summary: Change a card's PIN
 *     parameters:
 *       - in: path
 *         name: cardId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePinInput'
 *     responses:
 *       200:
 *         description: PIN changed successfully
 *       400:
 *         description: Bad request or invalid old PIN
 */
router.patch(
	"/:cardId/pin",
	validateRequest(changePinSchema),
	changePinController,
);

export default router;
