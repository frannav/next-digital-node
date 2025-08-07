import { Router } from "express";
import {
	createAccountController,
	getAccountsByUserController,
	getAccountByIdController,
} from "./account.controller.ts";
import { validateRequest } from "../../middleware/validateRequest.ts";
import {
	createAccountSchema,
	getAccountsByUserSchema,
	getAccountByIdSchema,
} from "./account.schema.ts";

const router: Router = Router();

router.post("/", validateRequest(createAccountSchema), createAccountController);
router.get(
	"/user/:userId",
	validateRequest(getAccountsByUserSchema),
	getAccountsByUserController,
);
router.get(
	"/:accountId",
	validateRequest(getAccountByIdSchema),
	getAccountByIdController,
);

export default router;
