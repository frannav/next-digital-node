import pinoHttp from "pino-http";
import pino from "pino";

const logger = pino({
	transport: {
		target: "pino-pretty",
		options: {
			colorize: true,
			translateTime: "SYS:dd-mm-yyyy HH:MM:ss",
			ignore: "pid,hostname",
		},
	},
});

export const requestLogger = pinoHttp({ logger });
