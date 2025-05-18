import dotenv from "dotenv";

dotenv.config();

export const config = {
	port: process.env.PORT || 3000,
	pageSpeedApiKey: process.env.PAGE_SPEED_API_KEY ?? '',
	openRouterApiKey: process.env.OPEN_ROUTER_API_KEY ?? '',
	firebaseProjectId: process.env.FIREBASE_PROJECT_ID ?? '',
	firebaseClientEmail: process.env.FIREBASE_CLIENT_EMAIL ?? '',
	firebasePrivateKey: process.env.FIREBASE_PRIVATE_KEY ?? '',
	VIRUSTOTAL_API_KEY: process.env.VIRUSTOTAL_API_KEY || "",
}