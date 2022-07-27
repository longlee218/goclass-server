import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
	path: path.join(process.cwd(), '.env'),
});

export const PREFIX_API_V1 = '/api/v1';
export const CLIENT_HOST = process.env.CLIENT_HOST;

export const DB_HOST = process.env.DB_HOST;
export const DB_USER = process.env.DB_USER;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_NAME = process.env.DB_NAME;

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

export const MOMO_PARTNER_CODE = process.env.MOMO_PARTNER_CODE;
export const MOMO_ACCESS_KEY = process.env.MOMO_ACCESS_KEY;
export const MOMO_SECRET_KEY = process.env.MOMO_SECRET_KEY;

export const PUBLIC_KEY = process.env.PUBLIC_KEY;
export const SECRET_KEY = process.env.SECRET_KEY;
export const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY;
