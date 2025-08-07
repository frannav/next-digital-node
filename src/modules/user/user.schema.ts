import { z } from "zod";

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateUserInput:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           default: John Doe
 *         email:
 *           type: string
 *           default: john.doe@example.com
 *         password:
 *           type: string
 *           default: string123
 *     CreateUserResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 */

export const createUserSchema = z.object({
	body: z.object({
		name: z.string().min(1, { message: "Name is required" }),
		email: z.string().email({ message: "Invalid email address" }),
		password: z
			.string()
			.min(6, { message: "Password must be at least 6 characters long" }),
	}),
});
