import { describe, expect, mock, test } from "bun:test";
import * as store from "../../../adapters/local-store/store";
import { getMovementsByAccountId } from "../movement.services";
import type { Movement } from "../movement.types";

mock.module("../../../adapters/local-store/store", () => ({
	getAll: mock(async () => []),
}));

describe("Movement Services", () => {
	test("getMovementsByAccountId should return movements for a given account", async () => {
		const mockMovements: Movement[] = [
			{ id: "mov_1", accountId: "acc_1", type: "deposit", amount: 100 },
			{ id: "mov_2", accountId: "acc_2", type: "withdrawal", amount: 50 },
			{ id: "mov_3", accountId: "acc_1", type: "fee", amount: 1 },
		];

		(store.getAll as jest.Mock).mockResolvedValueOnce(mockMovements);

		const movements = await getMovementsByAccountId("acc_1");

		expect(movements).toHaveLength(2);
		expect(movements[0].accountId).toBe("acc_1");
		expect(movements[1].accountId).toBe("acc_1");
	});
});
