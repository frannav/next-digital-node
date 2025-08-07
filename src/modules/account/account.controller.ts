import type { NextFunction, Request, Response } from "express";
import {
	createAccount,
	getAccountById,
	getAccountsByUserId,
} from "./account.services";

export const createAccountController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const account = await createAccount(req.body);
		res.status(201).json(account);
	} catch (error) {
		next(error);
	}
};

export const getAccountsByUserController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { userId } = req.params;
		if (!userId) {
			// In a real app, you'd probably want a more robust validation/error handling
			return res.status(400).json({ message: "User ID is required" });
		}
		const accounts = await getAccountsByUserId(userId);
		res.status(200).json(accounts);
	} catch (error) {
		next(error);
	}
};

export const getAccountByIdController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { accountId } = req.params;
		if (!accountId) {
			// In a real app, you'd probably want a more robust validation/error handling
			return res.status(400).json({ message: "Account ID is required" });
		}
		const account = await getAccountById(accountId);
		if (!account) {
			return res.status(404).json({ message: "Account not found" });
		}
		res.status(200).json(account);
	} catch (error) {
		next(error);
	}
};
