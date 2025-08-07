import { Router } from "express";
import { createUserController } from "./user.controller.ts";
import { validateRequest } from "../../middleware/validateRequest.ts";
import { createUserSchema } from "./user.schema.ts";

const router: Router = Router();

router.post("/", validateRequest(createUserSchema), createUserController);

export default router;
