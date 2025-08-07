import type { NextFunction, Request, Response } from "express";
import { getMovementsByAccountId } from "./movement.services";

export const getMovementsController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { accountId } = req.params;
		const movements = await getMovementsByAccountId(accountId);
		res.status(200).json(movements);
	} catch (error) {
		next(error);
	}
};
