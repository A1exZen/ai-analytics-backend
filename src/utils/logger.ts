import pino from "pino";

// @ts-ignore
const logger = pino({
	level: "info",
	transport: {
		target: "pino-pretty",
		options: { colorize: true },
	},
});

export default logger;