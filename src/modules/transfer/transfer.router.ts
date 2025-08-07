import { Router } from 'express';
import { createTransferController } from './transfer.controller.ts';
import { validateRequest } from '../../middleware/validateRequest.ts';
import { createTransferSchema } from './transfer.schema.ts';

const router: Router = Router();

router.post('/', validateRequest(createTransferSchema), createTransferController);

export default router;

