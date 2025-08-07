import { describe, expect, mock, test } from "bun:test";
import * as store from "../../../adapters/local-store/store";
import { HttpError } from "../../../utils/HttpError";
import { createDeposit } from "../deposit.services";

const mockCard = { id: "card_1", accountId: "acc_1" };
const mockAccount = { id: "acc_1", balance: 1000 };

mock.module("../../../adapters/local-store/store", () => ({
	getById: mock(async (collection, id) => {
		if (collection === "cards" && id === "card_1") return mockCard;
		if (collection === "accounts" && id === "acc_1") return mockAccount;
		return undefined;
	}),
	updateItem: mock(async () => true),
	createItem: mock(async () => true),
}));

describe("Deposit Services", () => {
	test("createDeposit should update balance and create movement", async () => {
		const depositData = { cardId: "card_1", amount: 200 };
		const result = await createDeposit(depositData);

		expect(result.newBalance).toBe(1200);
		expect(store.updateItem).toHaveBeenCalledWith("accounts", "acc_1", {
			balance: 1200,
		});
		expect(store.createItem).toHaveBeenCalledWith(
			"movements",
			expect.any(Object),
		);
	});

	test("createDeposit should throw error if card not found", async () => {
		const depositData = { cardId: "card_not_found", amount: 200 };
		await expect(createDeposit(depositData)).rejects.toThrow(
			new HttpError(404, "Card not found"),
		);
	});

	test("createDeposit should throw error if account not found", async () => {
		// Mock getById for cards to return a card with an invalid account
		(store.getById as jest.Mock).mockImplementationOnce(async (_coll, id) => ({
			id,
			accountId: "acc_not_found",
		}));
		const depositData = { cardId: "card_1", amount: 200 };
		await expect(createDeposit(depositData)).rejects.toThrow(
			new HttpError(404, "Account not found"),
		);
	});
});
