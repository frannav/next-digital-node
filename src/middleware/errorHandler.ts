import type { NextFunction, Request, Response } from "express";

// TODO: Implement a more robust error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (
	err: Error,
	req: Request,
	res: Response,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	next: NextFunction,
) => {
	console.error(err); // For debugging purposes
	res.status(500).json({ message: "Something went wrong" });
};
