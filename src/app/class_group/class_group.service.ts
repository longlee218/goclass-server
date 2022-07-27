import { ClassGroup, ClassRoom } from '../../models';
import { _403, _404 } from '../../config/message_code';

import HttpError from '../../utils/HttpError';
import { IUserDocument } from '../../models/user.model';

export class ClassGroupService {
	async createNewGroup(name: string, user: IUserDocument) {
		return await ClassGroup.create({ name, ownerId: user._id });
	}

	async getAllGroups(user: IUserDocument) {
		return await ClassGroup.find({ ownerId: user._id });
	}

	async updateGroup(id: string, user: IUserDocument, payload: any) {
		const group = await ClassGroup.findById(id);
		if (!group) {
			throw new HttpError(_404, 404, 'NOT_FOUND_ERROR');
		}
		if (!group.ownerId.equals(user._id)) {
			throw new HttpError(_403, 403, 'FORBIDEN_ERROR');
		}
		return await group.updateOne(payload, { new: true });
	}

	async deleteGroup(id: string, user: IUserDocument) {
		const group = await ClassGroup.findById(id);
		if (!group) {
			throw new HttpError(_404, 404, 'NOT_FOUND_ERROR');
		}
		if (!group.ownerId.equals(user._id)) {
			throw new HttpError(_403, 403, 'FORBIDEN_ERROR');
		}
		await ClassRoom.updateMany(
			{ ownerId: user._id, classRoomGroupId: id },
			{ classRoomGroupId: undefined }
		);
		await ClassGroup.deleteById(id);
	}
}

export default new ClassGroupService();
