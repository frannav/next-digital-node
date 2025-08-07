import * as store from "../../adapters/local-store/store";
import { HttpError } from "../../utils/HttpError";
import type { Account } from "../account/account.types";
import type { Card } from "../card/card.types";
import type { Movement } from "../movement/movement.types";

const OWN_BANK_ID = "our-bank";
const WITHDRAWAL_FEE = 1.5;

export const createWithdrawal = async (withdrawalData: {
	cardId: string;
	amount: number;
	atmBankId?: string;
}) => {
	const { cardId, amount, atmBankId } = withdrawalData;

	const card: Card = await store.getById("cards", cardId);
	if (!card) {
		throw new HttpError(404, "Card not found");
	}

	if (!card.activated) {
		throw new HttpError(400, "Card is not activated");
	}

	const account: Account = await store.getById("accounts", card.accountId);
	if (!account) {
		throw new HttpError(404, "Account not found");
	}

	const fee = atmBankId && atmBankId !== OWN_BANK_ID ? WITHDRAWAL_FEE : 0;
	const totalAmount = amount + fee;

	if (card.type === "debit" && account.balance < totalAmount) {
		throw new HttpError(400, "Insufficient funds");
	}

	if (
		card.type === "credit" &&
		account.balance + (card.creditLimit || 0) < totalAmount
	) {
		throw new HttpError(400, "Credit limit exceeded");
	}

	const newBalance = account.balance - totalAmount;
	await store.updateItem("accounts", account.id, { balance: newBalance });

	const withdrawalMovement: Movement = {
		id: `mov_${Date.now()}`,
		accountId: account.id,
		type: "withdrawal",
		amount,
		date: new Date().toISOString(),
		description: "ATM Withdrawal",
	};
	await store.createItem("movements", withdrawalMovement);

	if (fee > 0) {
		const feeMovement: Movement = {
			id: `mov_${Date.now() + 1}`,
			accountId: account.id,
			type: "fee",
			amount: fee,
			date: new Date().toISOString(),
			description: "Withdrawal fee for external ATM",
		};
		await store.createItem("movements", feeMovement);
	}

	return {
		message: "Withdrawal processed successfully",
		newBalance,
	};
};
