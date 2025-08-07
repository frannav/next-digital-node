import type { Request, Response } from "express";
import {
	createCard,
	getCardById,
	activateCard,
	changePin,
} from "./card.services.ts";

export const createCardController = async (req: Request, res: Response) => {
	try {
		const card = await createCard(req.body);
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { pinHash, ...cardResponse } = card;
		res.status(201).json(cardResponse);
	} catch (error) {
		res
			.status(500)
			.json({
				message: "Error creating card",
				error: error instanceof Error ? error.message : "Unknown error",
			});
	}
};

export const getCardByIdController = async (req: Request, res: Response) => {
	try {
		const { cardId } = req.params;
		if (!cardId) {
			return res.status(400).json({ message: "Card ID is required" });
		}
		const card = await getCardById(cardId);
		if (!card) return res.status(404).json({ message: "Card not found" });
		res.status(200).json(card);
	} catch (error) {
		res
			.status(500)
			.json({
				message: "Error fetching card",
				error: error instanceof Error ? error.message : "Unknown error",
			});
	}
};

export const activateCardController = async (req: Request, res: Response) => {
	try {
		const { cardId, pin } = req.body;
		const success = await activateCard(cardId, pin);
		if (!success)
			return res.status(400).json({ message: "Invalid card ID or PIN" });
		res.status(200).json({ message: "Card activated successfully" });
	} catch (error) {
		res
			.status(500)
			.json({
				message: "Error activating card",
				error: error instanceof Error ? error.message : "Unknown error",
			});
	}
};

export const changePinController = async (req: Request, res: Response) => {
	try {
		const { cardId } = req.params;
		if (!cardId) {
			return res.status(400).json({ message: "Card ID is required" });
		}
		const { oldPin, newPin } = req.body;
		const success = await changePin(cardId, oldPin, newPin);
		if (!success)
			return res.status(400).json({ message: "Invalid card ID or old PIN" });
		res.status(200).json({ message: "PIN changed successfully" });
	} catch (error) {
		res
			.status(500)
			.json({
				message: "Error changing PIN",
				error: error instanceof Error ? error.message : "Unknown error",
			});
	}
};
