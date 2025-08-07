import type { Request, Response } from 'express';
import { getMovementsByAccountId } from './movement.services.ts';

export const getMovementsController = async (req: Request, res: Response) => {
  try {
    const { accountId } = req.params;
    if (!accountId) {
      return res.status(400).json({ message: 'Account ID is required' });
    }
    const movements = await getMovementsByAccountId(accountId);
    res.status(200).json(movements);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching movements', error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

