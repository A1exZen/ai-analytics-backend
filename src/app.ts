import express from "express";
import cors from "cors";
import logger from "./utils/logger.js";
import { config } from "./config/env.js";
import analysisRoutes from "./routes/analysisRoutes.js";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/authRoutes.js";

const requestLogger = (req: express.Request, res: express.Response, next: express.NextFunction) => {
	logger.info(`${req.method} ${req.url} - Request received`);
	res.on("finish", () => {
		logger.info(`${req.method} ${req.url} - Response sent with status ${res.statusCode}`);
	});
	next();
};

const app = express();

app.use(requestLogger);
app.use(cors());
app.use(express.json());

app.use(
	rateLimit({
		windowMs: 15 * 60 * 1000,
		max: 100,
	})
);

app.use("/api", analysisRoutes);
app.use("/auth", authRoutes)

app.listen(config.port, () => {
	logger.info(`Listening on port ${config.port}`);
});