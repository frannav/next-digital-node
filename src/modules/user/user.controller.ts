import type { NextFunction, Request, Response } from "express";
import { createUser } from "./user.services";

export const createUserController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { name, email, password } = req.body;
		const user = await createUser({ name, email, password });
		const { passwordHash: _, ...userResponse } = user;
		res.status(201).json(userResponse);
	} catch (error) {
		next(error);
	}
};
