import * as store from "../../adapters/local-store/store.ts";
import type { Card } from "./card.types.ts";
import bcrypt from "bcrypt";

const saltRounds = 10;

const hashPin = (pin: string) => bcrypt.hash(pin, saltRounds);
const verifyPin = (pin: string, hash: string) => bcrypt.compare(pin, hash);

export const createCard = async (cardData: {
	accountId: string;
	type: "debit" | "credit";
	pin: string;
	creditLimit?: number;
}): Promise<Card> => {
	const pinHash = await hashPin(cardData.pin);

	const newCard: Card = {
		id: `card_${Date.now()}`,
		accountId: cardData.accountId,
		type: cardData.type,
		pinHash: pinHash,
		creditLimit: cardData.creditLimit,
		activated: false,
	};

	return store.createItem("cards", newCard);
};

export const getCardById = async (
	cardId: string,
): Promise<Omit<Card, "pinHash"> | undefined> => {
	const card = await store.getById("cards", cardId);
	if (card) {
		const { pinHash, ...cardWithoutPin } = card;
		return cardWithoutPin;
	}
	return undefined;
};

export const activateCard = async (
	cardId: string,
	pin: string,
): Promise<boolean> => {
	const card = await store.getById("cards", cardId);
	if (card && (await verifyPin(pin, card.pinHash))) {
		await store.updateItem("cards", cardId, { activated: true });
		return true;
	}
	return false;
};

export const changePin = async (
	cardId: string,
	oldPin: string,
	newPin: string,
): Promise<boolean> => {
	const card = await store.getById("cards", cardId);
	if (card && (await verifyPin(oldPin, card.pinHash))) {
		const newPinHash = await hashPin(newPin);
		await store.updateItem("cards", cardId, { pinHash: newPinHash });
		return true;
	}
	return false;
};
