import express from "express";
import cors from "cors";
import logger from "./utils/logger.js";
import { config } from "./config/env.js";
import analysisRoutes from "./routes/analysisRoutes.js";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/authRoutes.js";
import { Request, Response, NextFunction } from "express";
import {AnalysisResponse} from "./models/Analysis.js";
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

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	logger.error(`Unhandled error: ${err.message}`);
	res.status(500).json({ error: "Internal server error" });
});

app.use(
	rateLimit({
		windowMs: 15 * 60 * 1000,
		max: 100,
	})
);

interface Task {
	taskId: string;
	status: "pending" | "completed" | "failed";
	result?: AnalysisResponse;
	error?: string;
}

const tasks = new Map<string, Task>();

app.get("/api/analyze/stream/:taskId", (req: Request, res: Response) => {
	const taskId = req.params.taskId;

	res.setHeader("Content-Type", "text/event-stream");
	res.setHeader("Cache-Control", "no-cache");
	res.setHeader("Connection", "keep-alive");
	res.flushHeaders();

	const sendUpdate = (message: Task) => {
		res.write(`data: ${JSON.stringify(message)}\n\n`);
	};

	sendUpdate({ status: "pending", taskId });

	const interval = setInterval(() => {
		const task = tasks.get(taskId);
		if (!task) {
			sendUpdate({ status: "failed", taskId, error: "Task not found" });
			clearInterval(interval);
			res.end();
			return;
		}

		sendUpdate(task);

		if (task.status === "completed" || task.status === "failed") {
			clearInterval(interval);
			res.end();
		}
	}, 2000);

	req.on("close", () => {
		clearInterval(interval);
		res.end();
		logger.info(`SSE connection closed for taskId: ${taskId}`);
	});
});

app.use("/api", analysisRoutes);
app.use("/auth", authRoutes)

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
	logger.info(`Listening on port ${PORT}`);
});

export default app;
export { tasks };