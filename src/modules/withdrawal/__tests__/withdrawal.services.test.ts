import { beforeEach, describe, expect, mock, test } from "bun:test";
import * as store from "../../../adapters/local-store/store";
import { HttpError } from "../../../utils/HttpError";
import { createWithdrawal } from "../withdrawal.services";

// --- Mocks ---
const mockDebitCard = {
	id: "debit_card",
	accountId: "acc_1",
	activated: true,
	type: "debit",
};
const mockCreditCard = {
	id: "credit_card",
	accountId: "acc_1",
	activated: true,
	type: "credit",
	creditLimit: 500,
};
const mockInactiveCard = {
	id: "inactive_card",
	accountId: "acc_1",
	activated: false,
	type: "debit",
};
const mockAccount = { id: "acc_1", balance: 1000 };

mock.module("../../../adapters/local-store/store", () => ({
	getById: mock(async (collection, id) => {
		if (collection === "cards") {
			if (id === "debit_card") return mockDebitCard;
			if (id === "credit_card") return mockCreditCard;
			if (id === "inactive_card") return mockInactiveCard;
		}
		if (collection === "accounts" && id === "acc_1") return mockAccount;
		return undefined;
	}),
	updateItem: mock(async () => true),
	createItem: mock(async () => true),
}));

describe("Withdrawal Service", () => {
	beforeEach(() => {
		// Reset mocks before each test
		(store.createItem as jest.Mock).mockClear();
	});

	test("should process debit withdrawal successfully", async () => {
		const result = await createWithdrawal({
			cardId: "debit_card",
			amount: 100,
		});
		expect(result.newBalance).toBe(900);
		expect(store.createItem).toHaveBeenCalledTimes(1);
	});

	test("should process debit withdrawal with fee", async () => {
		const result = await createWithdrawal({
			cardId: "debit_card",
			amount: 100,
			atmBankId: "other-bank",
		});
		expect(result.newBalance).toBe(1000 - 100 - 1.5);
		expect(store.createItem).toHaveBeenCalledTimes(2); // withdrawal + fee
	});

	test("should throw error for insufficient funds on debit card", async () => {
		await expect(
			createWithdrawal({ cardId: "debit_card", amount: 2000 }),
		).rejects.toThrow(new HttpError(400, "Insufficient funds"));
	});

	test("should process credit withdrawal successfully", async () => {
		const result = await createWithdrawal({
			cardId: "credit_card",
			amount: 1200,
		});
		expect(result.newBalance).toBe(1000 - 1200); // -200
		expect(store.createItem).toHaveBeenCalledTimes(1);
	});

	test("should throw error for exceeding credit limit", async () => {
		await expect(
			createWithdrawal({ cardId: "credit_card", amount: 1600 }),
		).rejects.toThrow(new HttpError(400, "Credit limit exceeded"));
	});

	test("should throw error if card is not activated", async () => {
		await expect(
			createWithdrawal({ cardId: "inactive_card", amount: 100 }),
		).rejects.toThrow(new HttpError(400, "Card is not activated"));
	});
});
