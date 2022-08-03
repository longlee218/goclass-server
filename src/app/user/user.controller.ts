import { NextFunction, Request, Response } from 'express';

class UserController {
	public async getProfile(req: Request, res: Response, next: NextFunction) {
		return res.status(200).json({ profile: req.user });
	}
}

export default new UserController();
