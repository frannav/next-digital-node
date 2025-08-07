import { afterAll, beforeAll, describe, expect, mock, test } from "bun:test";
import type { Server } from "node:http";
import app from "../../src/app";
import type { Account } from "../../src/modules/account/account.types";

// Mock the store
mock.module("../../src/adapters/local-store/store", () => ({
	createItem: mock(async (_collection: string, item: Account) => ({
		...item,
		id: "new_acc_id",
	})),
	getAll: mock(async () => [
		{ id: "acc_1", userId: "user_123", balance: 100 },
		{ id: "acc_2", userId: "user_123", balance: 200 },
	]),
	getById: mock(async (_collection: string, id: string) => {
		if (id === "acc_1") {
			return { id: "acc_1", userId: "user_123", balance: 100 };
		}
		return undefined;
	}),
}));

describe("Account Integration Tests", () => {
	let server: Server;
	const port = 3002;
	const baseUrl = `http://localhost:${port}`;

	beforeAll(() => {
		server = app.listen(port);
	});

	afterAll(() => {
		server.close();
	});

	test("POST /api/accounts - should create a new account", async () => {
		const accountData = {
			userId: "user_123",
			IBAN: "ES9121000418450200051332",
			currency: "EUR",
			initialBalance: 1000,
		};
		const response = await fetch(`${baseUrl}/api/accounts`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(accountData),
		});
		const responseBody = await response.json();

		expect(response.status).toBe(201);
		expect(responseBody.id).toBe("new_acc_id");
		expect(responseBody.balance).toBe(1000);
	});

	test("GET /api/accounts/user/:userId - should get user accounts", async () => {
		const response = await fetch(`${baseUrl}/api/accounts/user/user_123`);
		const responseBody = await response.json();

		expect(response.status).toBe(200);
		expect(responseBody).toHaveLength(2);
		expect(responseBody[0].userId).toBe("user_123");
	});

	test("GET /api/accounts/:accountId - should get account by id", async () => {
		const response = await fetch(`${baseUrl}/api/accounts/acc_1`);
		const responseBody = await response.json();

		expect(response.status).toBe(200);
		expect(responseBody.id).toBe("acc_1");
	});

	test("GET /api/accounts/:accountId - should return 404 for non-existent account", async () => {
		const response = await fetch(`${baseUrl}/api/accounts/non_existent_id`);
		expect(response.status).toBe(404);
	});
});
