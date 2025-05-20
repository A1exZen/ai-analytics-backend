import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";

declare global {
	namespace Express {
		interface Request {
			user?: { userId: string; firebaseUid: string };
		}
	}
}

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		logger.warn("No token provided in request");
		res.status(401).json({ error: "No token provided" });
		return;
	}

	const token = authHeader.split("Bearer ")[1];

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as { userId: string; firebaseUid: string };
		req.user = decoded;
		logger.info(`User authenticated: ${decoded.userId}`);
		next();
	} catch (error) {
		logger.error(`Authentication error: ${(error as Error).message}`);
		res.status(401).json({ error: "Invalid token" });
	}
};
