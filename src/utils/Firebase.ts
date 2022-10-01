import { decryptData, encryptData } from './Encryption';
import { isFreeDrawElement, isLinearElement } from './TypeCheck';
import { reconcileElements } from './Reconciliation';
// @ts-ignore
import serviceAccount from '../../firebase.json';

let isFirebaseInitialized = false;
let firebasePromise: Promise<typeof import('firebase/app').default> | null =
	null;
let firestorePromise: Promise<any> | null | true = null;
const DELETED_ELEMENT_TIMEOUT = 24 * 60 * 60 * 1000;

const _loadFirebase = async () => {
	const firebase = (
		await import(/* webpackChunkName: "firebase" */ 'firebase/app')
	).default;

	if (!isFirebaseInitialized) {
		try {
			firebase.initializeApp(serviceAccount);
		} catch (error: any) {
			throw error;
		}
		isFirebaseInitialized = true;
	}

	return firebase;
};
const _getFirebase = async (): Promise<
	typeof import('firebase/app').default
> => {
	if (!firebasePromise) {
		firebasePromise = _loadFirebase();
	}
	return firebasePromise;
};

export const loadFirestore = async () => {
	const firebase = await _getFirebase();
	if (!firestorePromise) {
		firestorePromise = import(
			/* webpackChunkName: "firestore" */ 'firebase/firestore'
		);
	}
	if (firestorePromise !== true) {
		await firestorePromise;
		firestorePromise = true;
	}
	return firebase;
};

export const loadFromFirebase = async (roomId: string, roomKey: string) => {
	const firebase = await loadFirestore();
	const db = firebase.firestore();
	const docRef = db.collection('scenes').doc(roomId);
	const doc = await docRef.get();
	if (!doc.exists) {
		return null;
	}
	const storedScene = doc.data();
	const elements = getSyncableElements(
		await decryptedElements(storedScene, roomKey)
	);
	return elements;
};

export const saveToFirebase = async (
	portal: {
		roomId: string | null;
		roomKey: string | null;
	},
	elements: any[],
	appState: object
) => {
	const { roomId, roomKey } = portal;
	if (!roomId || !roomKey) {
		return false;
	}
	const firebase = await loadFirestore();
	const firestore = firebase.firestore();
	const docRef = firestore.collection('scenes').doc(roomId);
	const savedData = await firestore.runTransaction(async (transaction) => {
		const snapshot = await transaction.get(docRef);
		if (!snapshot.exists) {
			const sceneDocument = await createFirebaseSceneDocument(
				firebase,
				elements,
				roomKey
			);

			transaction.set(docRef, sceneDocument);

			return {
				elements,
				reconciledElements: null,
			};
		}

		const prevDocData = snapshot.data();
		const prevElements = getSyncableElements(
			await decryptedElements(prevDocData, roomKey)
		);

		const reconciledElements = getSyncableElements(
			reconcileElements(elements, prevElements, appState)
		);

		const sceneDocument = await createFirebaseSceneDocument(
			firebase,
			reconciledElements,
			roomKey
		);

		transaction.update(docRef, sceneDocument);
		return {
			elements,
			reconciledElements,
		};
	});
	return { reconciledElements: savedData.reconciledElements };
};

export const createFirebaseSceneDocument = async (
	firebase: any,
	elements: any[],
	roomKey: string
) => {
	const sceneVersion = getSceneVersion(elements);
	const { ciphertext, iv } = await encryptElements(roomKey, elements);
	return {
		sceneVersion,
		ciphertext: firebase.firestore.Blob.fromUint8Array(
			new Uint8Array(ciphertext)
		),
		iv: firebase.firestore.Blob.fromUint8Array(iv),
	};
};

const encryptElements = async (
	key: string,
	elements: readonly any[]
): Promise<{ ciphertext: ArrayBuffer; iv: Uint8Array }> => {
	const json = JSON.stringify(elements);
	const encoded = new TextEncoder().encode(json);
	const { encryptedBuffer, iv } = await encryptData(key, encoded);
	return { ciphertext: encryptedBuffer, iv };
};

export const decryptedElements = async (
	dataFromFirebase: any,
	roomKey: string
) => {
	const ciphertext = dataFromFirebase.ciphertext.toUint8Array();
	const iv = dataFromFirebase.iv.toUint8Array();
	const decrypted = await decryptData(iv, ciphertext, roomKey);
	const decodedData = new TextDecoder('utf-8').decode(
		new Uint8Array(decrypted)
	);
	return JSON.parse(decodedData);
};

export const getSceneVersion = (elements: readonly any[]) =>
	elements.reduce((acc, el) => acc + el.version, 0);

export const getSyncableElements = (elements: readonly any[]) =>
	elements.filter((element) => isSyncableElement(element));

export const isSyncableElement = (element: any) => {
	if (element.isDeleted) {
		if (element.updated > Date.now() - DELETED_ELEMENT_TIMEOUT) {
			return true;
		}
		return false;
	}
	return !isInvisiblySmallElement(element);
};

export const isInvisiblySmallElement = (element: any): boolean => {
	if (isLinearElement(element) || isFreeDrawElement(element)) {
		return element.points.length < 2;
	}
	return element.width === 0 && element.height === 0;
};
