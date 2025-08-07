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

const router: Router = Router({ mergeParams: true });

/**
 * @openapi
 * /api/accounts:
 *   post:
 *     tags:
 *       - Accounts
 *     summary: Create a new account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAccountInput'
 *     responses:
 *       201:
 *         description: Account created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateAccountResponse'
 *       400:
 *         description: Bad request
 */
router.post("/", validateRequest(createAccountSchema), createAccountController);

/**
 * @openapi
 * /api/accounts/user/{userId}:
 *   get:
 *     tags:
 *       - Accounts
 *     summary: Get all accounts for a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of accounts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Account'
 *       404:
 *         description: User not found
 */
router.get(
	"/user/:userId",
	validateRequest(getAccountsByUserSchema),
	getAccountsByUserController,
);

/**
 * @openapi
 * /api/accounts/{accountId}:
 *   get:
 *     tags:
 *       - Accounts
 *     summary: Get an account by its ID
 *     parameters:
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Account details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Account'
 *       404:
 *         description: Account not found
 */
router.get(
	"/:accountId",
	validateRequest(getAccountByIdSchema),
	getAccountByIdController,
);

export default router;
