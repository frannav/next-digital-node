import bcrypt from "bcrypt";
import * as store from "../../adapters/local-store/store";
import type { User } from "./user.types";

const saltRounds = 10;

export const createUser = async (
	userData: Omit<User, "id" | "passwordHash"> & { password?: string },
): Promise<User> => {
	if (!userData.password) {
		throw new Error("Password is required");
	}

	const allUsers: User[] = await store.getAll("users");
	const emailExists = allUsers.some((user) => user.email === userData.email);

	if (emailExists) {
		throw new Error("Email already in use");
	}

	const passwordHash = await bcrypt.hash(userData.password, saltRounds);

	const newUser: User = {
		id: `user_${Date.now()}`,
		name: userData.name,
		email: userData.email,
		passwordHash: passwordHash,
	};

	return store.createItem("users", newUser);
};
