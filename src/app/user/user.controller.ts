import { Request, Response } from 'express';

class UserController {
	public async getProfile(req: Request, res: Response) {
		return res.status(200).json({ profile: req.user });
	}
}

export default new UserController();
