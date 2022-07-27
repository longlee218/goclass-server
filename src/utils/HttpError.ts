export default class HttpError extends Error {
	private status: number;
	private isSuccess: boolean;
	constructor(msg: string, status: number = 400, name: string = '') {
		super(msg);
		this.name = name || 'HttpError';
		this.status = status;
		this.isSuccess = 100 < status && status < 300;
		Error.captureStackTrace(this, this.constructor);
	}
}
