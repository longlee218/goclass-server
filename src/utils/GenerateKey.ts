import crypto from 'crypto';

function generateRandomKey(byte: number = 48): string {
	return crypto.randomBytes(byte).toString('hex');
}

export default generateRandomKey;
