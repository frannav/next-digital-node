import type { Request, Response } from "express";
import { createDeposit } from "./deposit.services.ts";

export const createDepositController = async (req: Request, res: Response) => {
	try {
		const result = await createDeposit(req.body);
		if (!result.success) {
			return res.status(400).json({ message: result.message });
		}
		res.status(200).json(result);
	} catch (error) {
		res
			.status(500)
			.json({
				message: "Error processing deposit",
				error: error instanceof Error ? error.message : "Unknown error",
			});
	}
};
