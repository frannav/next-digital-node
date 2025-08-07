import type { Request, Response } from "express";
import {
	createAccount,
	getAccountsByUserId,
	getAccountById,
} from "./account.services.ts";

export const createAccountController = async (req: Request, res: Response) => {
	try {
		const account = await createAccount(req.body);
		res.status(201).json(account);
	} catch (error) {
		res
			.status(500)
			.json({
				message: "Error creating account",
				error: error instanceof Error ? error.message : "Unknown error",
			});
	}
};

export const getAccountsByUserController = async (
	req: Request,
	res: Response,
) => {
	try {
		const { userId } = req.params;
		if (!userId) {
			return res.status(400).json({ message: "User ID is required" });
		}
		const accounts = await getAccountsByUserId(userId);
		res.status(200).json(accounts);
	} catch (error) {
		res
			.status(500)
			.json({
				message: "Error fetching accounts",
				error: error instanceof Error ? error.message : "Unknown error",
			});
	}
};

export const getAccountByIdController = async (req: Request, res: Response) => {
	try {
		const { accountId } = req.params;
		if (!accountId) {
			return res.status(400).json({ message: "Account ID is required" });
		}
		const account = await getAccountById(accountId);
		if (!account) {
			return res.status(404).json({ message: "Account not found" });
		}
		res.status(200).json(account);
	} catch (error) {
		res
			.status(500)
			.json({
				message: "Error fetching account",
				error: error instanceof Error ? error.message : "Unknown error",
			});
	}
};
