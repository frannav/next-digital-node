import type { NextFunction, Request, Response } from "express";
import {
	activateCard,
	changePin,
	createCard,
	getCardById,
} from "./card.services";

export const createCardController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const card = await createCard(req.body);
		const { pinHash: _, ...cardResponse } = card;
		res.status(201).json(cardResponse);
	} catch (error) {
		next(error);
	}
};

export const getCardByIdController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { cardId } = req.params;
		if (!cardId) {
			return res.status(400).json({ message: "Card ID is required" });
		}
		const card = await getCardById(cardId);
		if (!card) return res.status(404).json({ message: "Card not found" });
		res.status(200).json(card);
	} catch (error) {
		next(error);
	}
};

export const activateCardController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { cardId, pin } = req.body;
		const success = await activateCard(cardId, pin);
		if (!success) {
			return res.status(400).json({ message: "Invalid card ID or PIN" });
		}
		res.status(200).json({ message: "Card activated successfully" });
	} catch (error) {
		next(error);
	}
};

export const changePinController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { cardId } = req.params;
		if (!cardId) {
			return res.status(400).json({ message: "Card ID is required" });
		}
		const { oldPin, newPin } = req.body;
		const success = await changePin(cardId, oldPin, newPin);
		if (!success) {
			return res.status(400).json({ message: "Invalid card ID or old PIN" });
		}
		res.status(200).json({ message: "PIN changed successfully" });
	} catch (error) {
		next(error);
	}
};
