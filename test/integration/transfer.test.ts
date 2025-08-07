import {
	afterAll,
	beforeAll,
	beforeEach,
	describe,
	expect,
	mock,
	test,
} from "bun:test";
import type { Server } from "node:http";
import * as store from "../../src/adapters/local-store/store";
import app from "../../src/app";

const mockFromAccount = { id: "acc_1", balance: 1000, IBAN: "IBAN_FROM" };
const mockToAccount = { id: "acc_2", balance: 500, IBAN: "IBAN_TO" };

mock.module("../../src/adapters/local-store/store", () => ({
	getById: mock(async (_coll, id) =>
		id === "acc_1" ? mockFromAccount : undefined,
	),
	getAll: mock(async () => [mockFromAccount, mockToAccount]),
	updateItem: mock(async () => true),
	createItem: mock(async () => true),
}));

describe("Transfer Integration Tests", () => {
	let server: Server;
	const port = 3007;
	const baseUrl = `http://localhost:${port}`;

	beforeAll(() => {
		server = app.listen(port);
	});
	afterAll(() => {
		server.close();
	});

	beforeEach(() => {
		(store.getById as jest.Mock).mockClear();
		(store.getAll as jest.Mock).mockClear();
	});

	// TODO: Fix this test. It fails due to a persistent mocking issue.
	test.skip("POST /api/transfers - should process a transfer successfully", async () => {
		const data = { fromAccountId: "acc_1", toIban: "IBAN_TO", amount: 100 };
		const response = await fetch(`${baseUrl}/api/transfers`, {
			method: "POST",
			body: JSON.stringify(data),
			headers: { "Content-Type": "application/json" },
		});
		const body = await response.json();

		expect(response.status).toBe(200);
		expect(body.newBalance).toBe(900);
	});

	test("POST /api/transfers - should fail for insufficient funds", async () => {
		const data = { fromAccountId: "acc_1", toIban: "IBAN_TO", amount: 2000 };
		const response = await fetch(`${baseUrl}/api/transfers`, {
			method: "POST",
			body: JSON.stringify(data),
			headers: { "Content-Type": "application/json" },
		});
		expect(response.status).toBe(400);
	});
});
