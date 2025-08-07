import type { NextFunction, Request, Response } from "express";
import { createTransfer } from "./transfer.services";

export const createTransferController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const result = await createTransfer(req.body);
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};
