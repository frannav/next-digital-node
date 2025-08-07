import { afterAll, beforeAll, describe, expect, mock, test } from "bun:test";
import type { Server } from "node:http";
import app from "../../src/app";

// --- Mocks ---
const mockDebitCard = {
	id: "debit_card",
	accountId: "acc_1",
	activated: true,
	type: "debit",
};
const mockAccount = { id: "acc_1", balance: 1000 };

mock.module("../../src/adapters/local-store/store", () => ({
	getById: mock(async (collection, id) => {
		if (collection === "cards" && id === "debit_card") return mockDebitCard;
		if (collection === "accounts" && id === "acc_1") return mockAccount;
		return undefined;
	}),
	updateItem: mock(async () => true),
	createItem: mock(async () => true),
}));

describe("Withdrawal Integration Tests", () => {
	let server: Server;
	const port = 3006;
	const baseUrl = `http://localhost:${port}`;

	beforeAll(() => {
		server = app.listen(port);
	});
	afterAll(() => {
		server.close();
	});

	test("POST /api/withdrawals - should process withdrawal successfully", async () => {
		const data = { cardId: "debit_card", amount: 100 };
		const response = await fetch(`${baseUrl}/api/withdrawals`, {
			method: "POST",
			body: JSON.stringify(data),
			headers: { "Content-Type": "application/json" },
		});
		const body = await response.json();
		expect(response.status).toBe(200);
		expect(body.newBalance).toBe(900);
	});

	test("POST /api/withdrawals - should return 400 for insufficient funds", async () => {
		const data = { cardId: "debit_card", amount: 2000 };
		const response = await fetch(`${baseUrl}/api/withdrawals`, {
			method: "POST",
			body: JSON.stringify(data),
			headers: { "Content-Type": "application/json" },
		});
		expect(response.status).toBe(400);
	});
});
