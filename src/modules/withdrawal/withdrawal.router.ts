import { Router } from 'express';
import { createWithdrawalController } from './withdrawal.controller.ts';
import { validateRequest } from '../../middleware/validateRequest.ts';
import { createWithdrawalSchema } from './withdrawal.schema.ts';

const router = Router();

router.post('/', validateRequest(createWithdrawalSchema), createWithdrawalController);

export default router;

