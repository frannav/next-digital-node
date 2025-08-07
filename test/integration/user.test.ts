import { afterAll, beforeAll, describe, expect, mock, test } from "bun:test";
import type { Server } from "node:http";
import type { ZodIssue } from "zod";
import * as store from "../../src/adapters/local-store/store";
import app from "../../src/app";
import type { User } from "../../src/modules/user/user.types";

// Mock the store to avoid interacting with the actual db.json
mock.module("../../src/adapters/local-store/store", () => ({
	getAll: mock(async () => []),
	createItem: mock(async (_collection: string, item: User): Promise<User> => {
		return { ...item, id: `user_${Date.now()}` };
	}),
}));

describe("User Integration Tests", () => {
	let server: Server;
	const port = 3001;
	const baseUrl = `http://localhost:${port}`;

	// Start the server before all tests
	beforeAll(() => {
		server = app.listen(port);
	});

	// Close the server after all tests
	afterAll(() => {
		server.close();
	});

	describe("POST /api/users", () => {
		test("should create a new user and return it", async () => {
			const userData = {
				name: "Test User",
				email: "test.user@example.com",
				password: "strongPassword123",
			};

			const response = await fetch(`${baseUrl}/api/users`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(userData),
			});

			const responseBody = (await response.json()) as User;

			// Assertions
			expect(response.status).toBe(201);
			expect(responseBody.name).toBe(userData.name);
			expect(responseBody.email).toBe(userData.email);
			expect(responseBody.passwordHash).toBeUndefined();
			expect(store.createItem).toHaveBeenCalled();
		});

		test("should return 400 if required fields are missing", async () => {
			const incompleteUserData = {
				name: "Test User",
			};

			const response = await fetch(`${baseUrl}/api/users`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(incompleteUserData),
			});

			const responseBody = (await response.json()) as { errors: ZodIssue[] };

			expect(response.status).toBe(400);
			expect(responseBody.errors).toBeDefined();
		});
	});
});
