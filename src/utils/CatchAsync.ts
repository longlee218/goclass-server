import { NextFunction, Request, Response } from 'express';

export default (fn: Function) => {
	return (req: Request, res: Response, next: NextFunction) => {
		fn(req, res, next).catch((error: any) => {
			const isDevelop = process.env.MODE === 'develop';
			if (isDevelop) {
				return res.status(error?.status || 500).json({
					isSuccess: error.isSuccess,
					error: error,
					message: error.message,
					stacks: error.stack,
				});
			} else {
				return res
					.status(500)
					.json({ isSuccess: false, error: 'Oops something went wrong!' });
			}
		});
	};
};
