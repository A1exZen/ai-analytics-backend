import pino from "pino";

const logger = (pino as unknown as typeof import("pino").pino)({
	level: "info",
	transport: {
		target: "pino-pretty",
		options: { colorize: true },
	},
});

export default logger;