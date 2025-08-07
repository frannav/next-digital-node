import { describe, expect, mock, test } from "bun:test";
import * as bcrypt from "bcrypt";
import * as store from "../../../adapters/local-store/store";
import {
	activateCard,
	changePin,
	createCard,
	getCardById,
} from "../card.services";

// Mock store and bcrypt in a more robust way
const mockCard = {
	id: "card_1",
	pinHash: "hashed_pin",
	activated: false,
	accountId: "acc_1",
	type: "debit" as const,
};

mock.module("../../../adapters/local-store/store", () => ({
	createItem: mock(async (_, item) => item),
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

describe("Card Services", () => {
	test("createCard should hash the pin and create a card", async () => {
		const cardData = {
			accountId: "acc_1",
			type: "debit" as const,
			pin: "1234",
		};
		const card = await createCard(cardData);
		expect(card.pinHash).toBe("hashed_pin");
		expect(card.activated).toBe(false);
		expect(store.createItem).toHaveBeenCalled();
	});

	test("getCardById should return card without pinHash", async () => {
		const card = await getCardById("card_1");
		expect(card).toBeDefined();
		expect(card?.id).toBe("card_1");
		expect(card).not.toHaveProperty("pinHash");
	});

	test("activateCard should succeed with correct pin", async () => {
		const success = await activateCard("card_1", "1234");
		expect(success).toBe(true);
		expect(store.updateItem).toHaveBeenCalledWith("cards", "card_1", {
			activated: true,
		});
	});

	test("activateCard should fail with incorrect pin", async () => {
		const success = await activateCard("card_1", "9999");
		expect(success).toBe(false);
	});

	test("changePin should succeed with correct old pin", async () => {
		const success = await changePin("card_1", "1234", "5678");
		expect(success).toBe(true);
		expect(bcrypt.hash).toHaveBeenCalledWith("5678", 10);
		expect(store.updateItem).toHaveBeenCalledWith("cards", "card_1", {
			pinHash: "hashed_pin",
		});
	});

	test("changePin should fail with incorrect old pin", async () => {
		const success = await changePin("card_1", "9999", "5678");
		expect(success).toBe(false);
	});
});
