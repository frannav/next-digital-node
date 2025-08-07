import type { Request, Response } from "express";
import { createWithdrawal } from "./withdrawal.services.ts";

export const createWithdrawalController = async (
	req: Request,
	res: Response,
) => {
	try {
		const result = await createWithdrawal(req.body);
		if (!result.success) {
			return res.status(400).json({ message: result.message });
		}
		res.status(200).json(result);
	} catch (error) {
		res
			.status(500)
			.json({
				message: "Error processing withdrawal",
				error: error instanceof Error ? error.message : "Unknown error",
			});
	}
};
