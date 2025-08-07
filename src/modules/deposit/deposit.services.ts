import * as store from "../../adapters/local-store/store";
import { HttpError } from "../../utils/HttpError";
import type { Account } from "../account/account.types";
import type { Card } from "../card/card.types";
import type { Movement } from "../movement/movement.types";

export const createDeposit = async (depositData: {
	cardId: string;
	amount: number;
}) => {
	const { cardId, amount } = depositData;

	const card: Card = await store.getById("cards", cardId);
	if (!card) {
		throw new HttpError(404, "Card not found");
	}

	const account: Account = await store.getById("accounts", card.accountId);
	if (!account) {
		throw new HttpError(404, "Account not found");
	}

	// Update account balance
	const newBalance = account.balance + amount;
	await store.updateItem("accounts", account.id, { balance: newBalance });

	// Create deposit movement
	const depositMovement: Movement = {
		id: `mov_${Date.now()}`,
		accountId: account.id,
		type: "deposit",
		amount,
		date: new Date().toISOString(),
		description: "ATM Deposit",
	};
	await store.createItem("movements", depositMovement);

	return {
		message: "Deposit processed successfully",
		newBalance,
	};
};
