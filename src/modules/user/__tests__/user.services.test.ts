import { describe, expect, type Mock, mock, test } from "bun:test";
import * as bcrypt from "bcrypt";
import * as store from "../../../adapters/local-store/store";
import { createUser } from "../user.services";

// Mock the dependencies
mock.module("../../../adapters/local-store/store", () => ({
	getAll: mock(async () => []),
	createItem: mock(async (_, item) => item),
}));
// Mock the hash function from bcrypt
const mockHash = mock(async () => "hashed_password");
mock.module("bcrypt", () => ({
	__esModule: true,
	default: {
		hash: mockHash,
	},
	hash: mockHash,
}));

describe("User Services", () => {
	describe("createUser", () => {
		test("should create a new user successfully", async () => {
			const userData = {
				name: "John Doe",
				email: "john.doe@example.com",
				password: "password123",
			};

			(store.getAll as Mock<typeof store.getAll>).mockResolvedValueOnce([]);

			const newUser = await createUser(userData);

			expect(newUser.name).toBe(userData.name);
			expect(newUser.email).toBe(userData.email);
			expect(newUser.passwordHash).toBe("hashed_password");

			expect(store.createItem).toHaveBeenCalledWith("users", newUser);
			expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
		});

		test("should throw an error if email is already in use", async () => {
			const existingUser = {
				id: "user_1",
				name: "Jane Doe",
				email: "jane.doe@example.com",
				passwordHash: "some_hash",
			};
			const userData = {
				name: "John Doe",
				email: "jane.doe@example.com",
				password: "password123",
			};

			(store.getAll as Mock<typeof store.getAll>).mockResolvedValueOnce([
				existingUser,
			]);

			await expect(createUser(userData)).rejects.toThrow(
				"Email already in use",
			);
		});

		test("should throw an error if password is not provided", () => {
			const userData = {
				name: "John Doe",
				email: "john.doe@example.com",
			};

			const create = () => createUser(userData);

			expect(create).toThrow("Password is required");
		});
	});
});
