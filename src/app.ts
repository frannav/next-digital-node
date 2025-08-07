import express from 'express';
import type { Express } from 'express';
import cors from 'cors';
import { requestLogger } from './middleware/pino';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';

const app: Express = express();

app.use(requestLogger);
app.use(express.json());
app.use(cors());

app.use(routes);

app.use(errorHandler);

export default app;

