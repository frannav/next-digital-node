import { beforeEach, describe, expect, mock, test } from "bun:test";
import * as store from "../../../adapters/local-store/store";
import { createTransfer } from "../transfer.services";

const mockFromAccount = { id: "acc_1", balance: 1000, IBAN: "IBAN_FROM" };
const mockToAccount = { id: "acc_2", balance: 500, IBAN: "IBAN_TO" };

mock.module("../../../adapters/local-store/store", () => ({
	getById: mock(async (_coll, id) =>
		id === "acc_1" ? mockFromAccount : undefined,
	),
	getAll: mock(async () => [mockFromAccount, mockToAccount]),
	updateItem: mock(async () => true),
	createItem: mock(async () => true),
}));

describe("Transfer Service", () => {
	beforeEach(() => {
		(store.updateItem as jest.Mock).mockClear();
		(store.createItem as jest.Mock).mockClear();
	});

	test("should process transfer successfully", async () => {
		const data = { fromAccountId: "acc_1", toIban: "IBAN_TO", amount: 100 };
		const result = await createTransfer(data);

		expect(result.newBalance).toBe(900);
		expect(store.updateItem).toHaveBeenCalledTimes(2);
		expect(store.createItem).toHaveBeenCalledTimes(2);
	});

	test("should throw for insufficient funds", async () => {
		const data = { fromAccountId: "acc_1", toIban: "IBAN_TO", amount: 2000 };
		await expect(createTransfer(data)).rejects.toThrow("Insufficient funds");
	});

	test("should throw if destination account not found", async () => {
		const data = {
			fromAccountId: "acc_1",
			toIban: "IBAN_NOT_FOUND",
			amount: 100,
		};
		await expect(createTransfer(data)).rejects.toThrow(
			"Destination account not found",
		);
	});
});
