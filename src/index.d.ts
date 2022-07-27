import { IUserDocument } from './models/user.model';

declare global {
	namespace Express {
		interface User extends IUserDocument {}
	}
}
