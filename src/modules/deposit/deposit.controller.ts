import type { NextFunction, Request, Response } from "express";
import { createDeposit } from "./deposit.services";

export const createDepositController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const result = await createDeposit(req.body);
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};
