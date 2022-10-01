import { blobToArrayBuffer } from './Blob';
import crypto from 'crypto';

const ENCRYPTION_KEY_BITS = 128;
const IV_LENGTH_BYTES = 12;

export const getRandomValues = (buf: Uint8Array) => {
	const bytes = crypto.randomBytes(buf.length);
	buf.set(bytes);
	return buf;
};

export const createIV = () => {
	const arr = new Uint8Array(IV_LENGTH_BYTES);
	return getRandomValues(arr);
};

export const generateEncryptionKey = async <
	T extends 'string' | 'cryptoKey' = 'string'
>(
	returnAs?: T
) => {
	const key = await crypto.webcrypto.subtle.generateKey(
		{
			name: 'AES-GCM',
			length: ENCRYPTION_KEY_BITS,
		},
		true, // extractable
		['encrypt', 'decrypt']
	);
	return returnAs === 'cryptoKey'
		? key
		: (await crypto.webcrypto.subtle.exportKey('jwk', key)).k;
};

export const getCryptoKey = (key: string, usage: KeyUsage) =>
	crypto.webcrypto.subtle.importKey(
		'jwk',
		{
			alg: 'A128GCM',
			ext: true,
			k: key,
			key_ops: ['encrypt', 'decrypt'],
			kty: 'oct',
		},
		{
			name: 'AES-GCM',
			length: ENCRYPTION_KEY_BITS,
		},
		false, // extractable
		[usage]
	);

export const encryptData = async (
	key: string | CryptoKey,
	data: Uint8Array | ArrayBuffer | Blob | File | string
) => {
	const importedKey =
		typeof key === 'string' ? await getCryptoKey(key, 'encrypt') : key;
	const iv = createIV();
	const buffer =
		typeof data === 'string'
			? new TextEncoder().encode(data)
			: data instanceof Uint8Array
			? data
			: data instanceof Blob
			? await blobToArrayBuffer(data)
			: data;
	const encryptedBuffer = await crypto.webcrypto.subtle.encrypt(
		{
			name: 'AES-GCM',
			iv,
		},
		importedKey,
		buffer
	);

	return { encryptedBuffer, iv };
};

export const decryptData = async (
	iv: Uint8Array,
	encrypted: Uint8Array | ArrayBuffer,
	privateKey: string
) => {
	console.log({
		iv,
		encrypted,
		privateKey,
	});
	const key = await getCryptoKey(privateKey, 'decrypt');
	return crypto.webcrypto.subtle.decrypt(
		{
			name: 'AES-GCM',
			iv,
		},
		key,
		encrypted
	);
};
