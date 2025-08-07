import type { NextFunction, Request, Response } from "express";

interface HttpError extends Error {
	statusCode?: number;
}

export const errorHandler = (
	err: HttpError,
	_req: Request,
	res: Response,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	_next: NextFunction,
) => {
	console.error(err); // For debugging purposes

	const statusCode = err.statusCode || 500;
	const message = err.message || "Something went wrong";

	res.status(statusCode).json({ message });
};
