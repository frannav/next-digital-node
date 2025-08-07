import * as store from "../../adapters/local-store/store";
import { HttpError } from "../../utils/HttpError";
import type { Account } from "../account/account.types";
import type { Movement } from "../movement/movement.types";

export const createTransfer = async (transferData: {
	fromAccountId: string;
	toIban: string;
	amount: number;
}) => {
	const { fromAccountId, toIban, amount } = transferData;

	const fromAccount: Account = await store.getById("accounts", fromAccountId);
	if (!fromAccount) {
		throw new HttpError(404, "Source account not found");
	}

	if (fromAccount.balance < amount) {
		throw new HttpError(400, "Insufficient funds");
	}

	const allAccounts: Account[] = await store.getAll("accounts");
	const toAccount: Account | undefined = allAccounts.find(
		(acc) => acc.IBAN === toIban,
	);
	if (!toAccount) {
		throw new HttpError(404, "Destination account not found");
	}

	// Update balances
	const newFromBalance = fromAccount.balance - amount;
	const newToBalance = toAccount.balance + amount;
	await store.updateItem("accounts", fromAccount.id, {
		balance: newFromBalance,
	});
	await store.updateItem("accounts", toAccount.id, { balance: newToBalance });

	// Create movements
	const transferOutMovement: Movement = {
		id: `mov_${Date.now()}`,
		accountId: fromAccount.id,
		type: "transfer-out",
		amount,
		date: new Date().toISOString(),
		description: `Transfer to ${toIban}`,
	};
	await store.createItem("movements", transferOutMovement);

	const transferInMovement: Movement = {
		id: `mov_${Date.now() + 1}`,
		accountId: toAccount.id,
		type: "transfer-in",
		amount,
		date: new Date().toISOString(),
		description: `Transfer from ${fromAccount.IBAN}`,
	};
	await store.createItem("movements", transferInMovement);

	return {
		message: "Transfer processed successfully",
		newBalance: newFromBalance,
	};
};
