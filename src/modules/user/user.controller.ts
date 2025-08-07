import type { Request, Response } from 'express';
import { createUser } from './user.services.ts';

export const createUserController = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const user = await createUser({ name, email, password });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...userResponse } = user;
    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

