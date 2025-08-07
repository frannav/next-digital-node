import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest.ts";
import { createUserController } from "./user.controller.ts";
import { createUserSchema } from "./user.schema.ts";

const router: Router = Router();

router.post("/", validateRequest(createUserSchema), createUserController);

export default router;
