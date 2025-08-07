import { Router } from "express";
import accountRouter from "./modules/account/account.router";
import cardRouter from "./modules/card/card.router";
import depositRouter from "./modules/deposit/deposit.router";
import movementRouter from "./modules/movement/movement.router";
import transferRouter from "./modules/transfer/transfer.router";
import userRouter from "./modules/user/user.router";
import withdrawalRouter from "./modules/withdrawal/withdrawal.router";

const router: Router = Router();

router.use("/api/users", userRouter);
router.use("/api/accounts", accountRouter);
router.use("/api/cards", cardRouter);
router.use("/api/movements", movementRouter);
router.use("/api/withdrawals", withdrawalRouter);
router.use("/api/deposits", depositRouter);
router.use("/api/transfers", transferRouter);
export default router;
