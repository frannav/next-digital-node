import { describe, expect, mock, test } from "bun:test";
import * as store from "../../../adapters/local-store/store";
import {
	createAccount,
	getAccountById,
	getAccountsByUserId,
} from "../account.services";
import type { Account } from "../account.types";

// Mock the store module
mock.module("../../../adapters/local-store/store", () => ({
	createItem: mock(async (_collection: string, item: Account) => item),
	getAll: mock(async (_collection: string) => []),
	getById: mock(async (_collection: string, _id: string) => undefined),
}));

describe("Account Services", () => {
	test("createAccount should return a new account", async () => {
		const accountData = {
			userId: "user_123",
			IBAN: "ES9121000418450200051332",
			currency: "EUR",
			initialBalance: 1000,
		};

		const newAccount = await createAccount(accountData);

		expect(newAccount.userId).toBe(accountData.userId);
		expect(newAccount.balance).toBe(accountData.initialBalance);
		expect(store.createItem).toHaveBeenCalledWith("accounts", newAccount);
	});

	test("getAccountsByUserId should return accounts for a given user", async () => {
		const mockAccounts: Account[] = [
			{
				id: "acc_1",
				userId: "user_123",
				IBAN: "ES9121000418450200051332",
				currency: "EUR",
				balance: 1000,
			},
			{
				id: "acc_2",
				userId: "user_456",
				IBAN: "ES8021000418400200051333",
				currency: "EUR",
				balance: 500,
			},
		];

		(store.getAll as jest.Mock).mockResolvedValueOnce(mockAccounts);

		const accounts = await getAccountsByUserId("user_123");

		expect(accounts).toHaveLength(1);
		expect(accounts[0].userId).toBe("user_123");
	});

	test("getAccountById should return an account", async () => {
		const mockAccount: Account = {
			id: "acc_1",
			userId: "user_123",
			IBAN: "ES9121000418450200051332",
			currency: "EUR",
			balance: 1000,
		};

		(store.getById as jest.Mock).mockResolvedValueOnce(mockAccount);

		const account = await getAccountById("acc_1");

		expect(account).toBeDefined();
		expect(account?.id).toBe("acc_1");
		expect(store.getById).toHaveBeenCalledWith("accounts", "acc_1");
	});
});
