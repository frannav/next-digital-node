import cors from "cors";
import type { Express } from "express";
import express from "express";
import { errorHandler } from "./middleware/errorHandler";
import { requestLogger } from "./middleware/pino";
import routes from "./routes";

const app: Express = express();

app.use(requestLogger);
app.use(express.json());
app.use(cors());

app.use(routes);

app.use(errorHandler);

export default app;
