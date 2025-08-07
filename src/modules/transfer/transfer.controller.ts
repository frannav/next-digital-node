import type { Request, Response } from "express";
import { createTransfer } from "./transfer.services.ts";

export const createTransferController = async (req: Request, res: Response) => {
	try {
		const result = await createTransfer(req.body);
		if (!result.success) {
			return res.status(400).json({ message: result.message });
		}
		res.status(200).json(result);
	} catch (error) {
		res.status(500).json({
			message: "Error processing transfer",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
};
