export default class HttpError extends Error {
	private status: number;
	private isSuccess: boolean;
	private data: any;
	constructor(
		msg: string,
		status: number = 400,
		name: string = '',
		data: any = null
	) {
		super(msg);
		this.name = name || 'HttpError';
		this.status = status;
		this.isSuccess = 100 < status && status < 300;
		this.data = data || {};
		Error.captureStackTrace(this, this.constructor);
	}
}
