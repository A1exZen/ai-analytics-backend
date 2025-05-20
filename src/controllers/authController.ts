import { Request, Response, NextFunction } from "express";
import { auth } from "../config/firebase.js";
import logger from "../utils/logger.js";
import jwt from "jsonwebtoken";
import prisma from "../db.js";
import bcrypt from "bcrypt";

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const { email, password } = req.body;

	if (!email || !password) {
		res.status(400).json({ error: "Email and password are required" });
		return;
	}

	try {
		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await prisma.user.create({
			data: {
				email,
				password: hashedPassword,
			},
		});

		const jwtToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || "your-secret-key", { expiresIn: "1h" });
		logger.info(`User registered: ${email}`);
		res.status(201).json({ token: jwtToken, user: { id: user.id, email: user.email } });
	} catch (error) {
		logger.error(`Registration error: ${(error as Error).message}`);
		res.status(500).json({ error: "Registration failed" });
	}
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const { email, password } = req.body;

	if (!email || !password) {
		 res.status(400).json({ error: "Email and password are required" });
		return;
	}

	try {
		const user = await prisma.user.findUnique({ where: { email } });
		if (!user || !user.password) {
			res.status(401).json({ error: "Invalid credentials" });
			return;
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			res.status(401).json({ error: "Invalid credentials" });
			return;
		}

		const jwtToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || "your-secret-key", { expiresIn: "1h" });
		res.status(200).json({ token: jwtToken, user: { id: user.id, email: user.email } });
	} catch (error) {
		logger.error(`Login error: ${(error as Error).message}`);
		res.status(500).json({ error: "Login failed" });
	}
};

export const googleLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const { idToken } = req.body;

	if (!idToken) {
		res.status(400).json({ error: "No ID token provided" });
		return;
	}

	try {
		const decodedToken = await auth.verifyIdToken(idToken);
		const firebaseUid = decodedToken.uid;
		const email = decodedToken.email || "";

		let user = await prisma.user.findUnique({ where: { firebaseUid } });

		if (!user) {
			user = await prisma.user.create({
				data: {
					firebaseUid,
					email,
				},
			});
			logger.info(`New user registered with Google: ${email}`);
		} else {
			logger.info(`User logged in with Google: ${email}`);
		}

		const jwtToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || "your-secret-key", { expiresIn: "1h" });
		res.status(200).json({ token: jwtToken, user: { id: user.id, email: user.email } });
	} catch (error) {
		logger.error(`Google login error: ${(error as Error).message}`);
		res.status(401).json({ error: "Invalid token" });
	}
};