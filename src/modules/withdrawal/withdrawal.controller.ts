import type { NextFunction, Request, Response } from "express";
import { createWithdrawal } from "./withdrawal.services";

export const createWithdrawalController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const result = await createWithdrawal(req.body);
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};
