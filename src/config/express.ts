import express from "express";
import cors from "cors";

const createServer = () => {
	const app = express();

	app.use(express.json());
	app.use(cors());

	// TODO: Add routers

	return app;
};

export default createServer;
