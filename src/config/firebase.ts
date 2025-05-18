import admin from "firebase-admin";
import { config } from "./env.js";
import logger from "../utils/logger.js";

if (!admin.apps.length) {
	try {
		admin.initializeApp({
			credential: admin.credential.cert({
				projectId: config.firebaseProjectId,
				clientEmail: config.firebaseClientEmail,
				privateKey: config.firebasePrivateKey.replace(/\\n/g, "\n"),
			}),
		});
		logger.info("Firebase Admin SDK initialized successfully");
	} catch (error) {
		logger.error(`Failed to initialize Firebase Admin SDK: ${(error as Error).message}`);
		throw error;
	}
}

export const auth = admin.auth();
export const firestore = admin.firestore();
export default admin;