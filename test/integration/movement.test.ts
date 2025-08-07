import { afterAll, beforeAll, describe, expect, mock, test } from "bun:test";
import type { Server } from "node:http";
import app from "../../src/app";
import type { Movement } from "../../src/modules/movement/movement.types";

mock.module("../../src/adapters/local-store/store", () => ({
	getAll: mock(async (collection: string): Promise<Movement[]> => {
		if (collection === "movements") {
			return [
				{ id: "mov_1", accountId: "acc_1", type: "deposit", amount: 100 },
				{ id: "mov_2", accountId: "acc_2", type: "withdrawal", amount: 50 },
				{ id: "mov_3", accountId: "acc_1", type: "fee", amount: 1 },
			];
		}
		return [];
	}),
}));

describe("Movement Integration Tests", () => {
	let server: Server;
	const port = 3004;
	const baseUrl = `http://localhost:${port}`;

	beforeAll(() => {
		server = app.listen(port);
	});

	afterAll(() => {
		server.close();
	});

	test("GET /api/movements/account/:accountId - should return movements for an account", async () => {
		const response = await fetch(`${baseUrl}/api/movements/account/acc_1`);
		const responseBody = await response.json();

		expect(response.status).toBe(200);
		expect(responseBody).toHaveLength(2);
		expect(responseBody[0].accountId).toBe("acc_1");
	});

	test("GET /api/movements/account/:accountId - should return empty array for account with no movements", async () => {
		const response = await fetch(`${baseUrl}/api/movements/account/acc_3`);
		const responseBody = await response.json();

		expect(response.status).toBe(200);
		expect(responseBody).toHaveLength(0);
	});
});
