import { AssignmentFolder } from '../../models';
import { IUserDocument } from '../../models/user.model';
import { Types } from 'mongoose';

export class AssignmentService {
	async getFolderAndAssignment(
		query: any,
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
				...(query.name ? { name: query.name } : {}),
			});
		} else {
			folders = await AssignmentFolder.find({
				parentId,
				owner: user._id,
				...(query.name ? { name: query.name } : {}),
			});
		}
		return { folders, assignments };
	}

	async getBreadcrumps(
		parentId: Types.ObjectId | undefined | null,
		user: IUserDocument
	) {
		let itsMe: Array<Types.ObjectId> = [];
		// means root path
		if (!parentId) {
			return [];
		}
		let folder = await AssignmentFolder.findOne({
			owner: user._id,
			parentId: parentId,
		});
		// means empty
		if (!folder) {
			folder = await AssignmentFolder.findOne({
				owner: user._id,
				_id: parentId,
			});
			itsMe = [parentId];
		}
		const belongs = [...folder.belongs, ...itsMe];
		return await AssignmentFolder.find({
			_id: { $in: belongs },
			owner: user._id,
		});
	}
}

export default new AssignmentService();
