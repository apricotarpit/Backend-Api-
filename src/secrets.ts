import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const rawPort = process.env.PORT ?? "3000";
export const PORT = Number.parseInt(String(rawPort), 10);

if (Number.isNaN(PORT) || PORT < 0 || PORT > 65535) {
	throw new Error("PORT must be a number between 0 and 65535");
}

export const JWT_SECRET = process.env.JWT_SECRET || 'secret';
export const JWT_EXPIRES_IN = '1h';

