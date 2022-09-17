import { ClassGroup, ClassRoom } from '../../models';
import { ERROR_FORBIDDEN, ERROR_NOT_FOUND } from '../../config/error';
import { _403, _404 } from '../../config/message_code';

import HttpError from '../../utils/HttpError';
import { IUserDocument } from '../../models/user.model';
import { Types } from 'mongoose';

export class ClassGroupService {
	async createNewGroup(name: string, user: IUserDocument) {
		return await ClassGroup.create({ name, ownerId: user._id });
	}

	async getAllGroups(user: IUserDocument) {
		return await ClassGroup.find({ ownerId: user._id });
	}

	async updateGroup(id: string, user: IUserDocument, payload: any) {
		// const group = await ClassGroup.findById(id).orFail(
		// 	() => new HttpError(_404, 404, ERROR_NOT_FOUND)
		// );
		// if (!group.ownerId.equals(user._id)) {
		// 	throw new HttpError(_403, 403, ERROR_FORBIDDEN);
		// }
		// return await group.updateOne(payload, { new: true });
		return await ClassGroup.findByIdAndUpdate(id, payload, { new: true });
	}

	async deleteGroup(id: string, user: IUserDocument) {
		const group = await ClassGroup.findById(id).orFail(
			() => new HttpError(_404, 404, ERROR_NOT_FOUND)
		);
		if (!group.ownerId.equals(user._id)) {
			throw new HttpError(_403, 403, ERROR_FORBIDDEN);
		}
		await ClassRoom.updateMany(
			{ ownerId: user._id, classRoomGroupId: new Types.ObjectId(id) },
			{ $unset: { classRoomGroupId: 1 } }
		);
		await ClassGroup.deleteById(id, user._id);
	}
}

export default new ClassGroupService();
