import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest.ts";
import {
	createAccountController,
	getAccountByIdController,
	getAccountsByUserController,
} from "./account.controller.ts";
import {
	createAccountSchema,
	getAccountByIdSchema,
	getAccountsByUserSchema,
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
