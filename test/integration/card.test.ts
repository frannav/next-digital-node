import { afterAll, beforeAll, describe, expect, mock, test } from "bun:test";
import type { Server } from "node:http";
import app from "../../src/app";

// --- Mocks defined directly in the test file ---

const mockCard = {
	id: "card_1",
	pinHash: "hashed_pin",
	activated: false,
	accountId: "acc_1",
};

mock.module("../../src/adapters/local-store/store", () => ({
	createItem: mock(async (_, item) => ({ ...item, id: "card_new" })),
	getById: mock(async (_, id) => (id === "card_1" ? mockCard : undefined)),
	updateItem: mock(async () => true),
}));

const mockBcrypt = {
	hash: mock(async () => "hashed_pin"),
	compare: mock(async (pin, hash) => pin === "1234" && hash === "hashed_pin"),
};
mock.module("bcrypt", () => ({
	__esModule: true,
	default: mockBcrypt,
	...mockBcrypt,
}));

describe("Card Integration Tests", () => {
	let server: Server;
	const port = 3003;
	const baseUrl = `http://localhost:${port}`;

	beforeAll(() => {
		server = app.listen(port);
	});
	afterAll(() => {
		server.close();
	});

	test("POST /api/cards - should create a card", async () => {
		const cardData = { accountId: "acc_1", type: "debit", pin: "1234" };
		const res = await fetch(`${baseUrl}/api/cards`, {
			method: "POST",
			body: JSON.stringify(cardData),
			headers: { "Content-Type": "application/json" },
		});
		const body = await res.json();
		expect(res.status).toBe(201);
		expect(body.id).toBe("card_new");
		expect(body.pinHash).toBeUndefined();
	});

	test("GET /api/cards/:cardId - should get a card", async () => {
		const res = await fetch(`${baseUrl}/api/cards/card_1`);
		const body = await res.json();
		expect(res.status).toBe(200);
		expect(body.id).toBe("card_1");
	});

	test("POST /api/cards/activate - should activate a card", async () => {
		const activationData = { cardId: "card_1", pin: "1234" };
		const res = await fetch(`${baseUrl}/api/cards/activate`, {
			method: "POST",
			body: JSON.stringify(activationData),
			headers: { "Content-Type": "application/json" },
		});
		expect(res.status).toBe(200);
	});

	test("POST /api/cards/activate - should fail with wrong PIN", async () => {
		const activationData = { cardId: "card_1", pin: "9999" };
		const res = await fetch(`${baseUrl}/api/cards/activate`, {
			method: "POST",
			body: JSON.stringify(activationData),
			headers: { "Content-Type": "application/json" },
		});
		expect(res.status).toBe(400);
	});

	test("PATCH /api/cards/:cardId/pin - should change PIN", async () => {
		const pinData = { oldPin: "1234", newPin: "5678" };
		const res = await fetch(`${baseUrl}/api/cards/card_1/pin`, {
			method: "PATCH",
			body: JSON.stringify(pinData),
			headers: { "Content-Type": "application/json" },
		});
		expect(res.status).toBe(200);
	});

	test("PATCH /api/cards/:cardId/pin - should fail with wrong old PIN", async () => {
		const pinData = { oldPin: "9999", newPin: "5678" };
		const res = await fetch(`${baseUrl}/api/cards/card_1/pin`, {
			method: "PATCH",
			body: JSON.stringify(pinData),
			headers: { "Content-Type": "application/json" },
		});
		expect(res.status).toBe(400);
	});
});
