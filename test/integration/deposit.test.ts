import { afterAll, beforeAll, describe, expect, mock, test } from "bun:test";
import type { Server } from "node:http";
import app from "../../src/app";

const mockCard = { id: "card_1", accountId: "acc_1" };
const mockAccount = { id: "acc_1", balance: 1000 };

mock.module("../../src/adapters/local-store/store", () => ({
	getById: mock(async (collection, id) => {
		if (collection === "cards" && id === "card_1") return mockCard;
		if (collection === "accounts" && id === "acc_1") return mockAccount;
		return undefined;
	}),
	updateItem: mock(async () => true),
	createItem: mock(async () => true),
}));

describe("Deposit Integration Tests", () => {
	let server: Server;
	const port = 3005;
	const baseUrl = `http://localhost:${port}`;

	beforeAll(() => {
		server = app.listen(port);
	});
	afterAll(() => {
		server.close();
	});

	test("POST /api/deposits - should process a deposit successfully", async () => {
		const depositData = { cardId: "card_1", amount: 500 };
		const response = await fetch(`${baseUrl}/api/deposits`, {
			method: "POST",
			body: JSON.stringify(depositData),
			headers: { "Content-Type": "application/json" },
		});
		const body = await response.json();

		expect(response.status).toBe(200);
		expect(body.newBalance).toBe(1500);
	});

	test("POST /api/deposits - should return 404 if card not found", async () => {
		const depositData = { cardId: "card_not_found", amount: 500 };
		const response = await fetch(`${baseUrl}/api/deposits`, {
			method: "POST",
			body: JSON.stringify(depositData),
			headers: { "Content-Type": "application/json" },
		});

		expect(response.status).toBe(404);
	});
});
