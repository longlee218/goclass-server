import { AssignmentFolder } from '../../models';
import { IUserDocument } from '../../models/user.model';
import { Types } from 'mongoose';

export class AssignmentService {
	async getFolderAndAssignment(
		parentId: string | Types.ObjectId | null,
		user: IUserDocument
	) {
		let folders: any[] = [];
		let assignments: any[] = [];
		if (!parentId) {
			folders = await AssignmentFolder.find({
				$or: [
					{
						parentId: { $exists: false },
					},
					{
						parentId: null,
					},
				],
				owner: user._id,
			});
		} else {
			folders = await AssignmentFolder.find({ parentId, owner: user._id });
		}
		return { folders, assignments };
	}
}

export default new AssignmentService();
