import { Router } from "express";
import accountRouter from "./modules/account/account.router.ts";
import cardRouter from "./modules/card/card.router.ts";
import depositRouter from "./modules/deposit/deposit.router.ts";
import transferRouter from "./modules/transfer/transfer.router.ts";
import userRouter from "./modules/user/user.router.ts";
import withdrawalRouter from "./modules/withdrawal/withdrawal.router.ts";

const router: Router = Router();

router.use("/api/users", userRouter);
router.use("/api/accounts", accountRouter);
router.use("/api/cards", cardRouter);
// Nested route for movements under accounts
// TODO: error with movements route fix when finish mvp
// accountRouter.use('/:accountId/movements', movementRouter);
router.use("/api/withdrawals", withdrawalRouter);
router.use("/api/deposits", depositRouter);
router.use("/api/transfers", transferRouter);

export default router;
