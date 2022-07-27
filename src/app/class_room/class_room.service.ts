import { ERROR_FORBIDDEN, ERROR_NOT_FOUND } from '../../config/error';
import { _403, _404 } from '../../config/message_code';

import { ClassRoom } from '../../models';
import HttpError from '../../utils/HttpError';
import { IClassRoomDocument } from '../../models/class_room.model';
import { IUserDocument } from '../../models/user.model';
import class_groupService from '../class_group/class_group.service';

export class ClassRoomService {
	async getClassAndGroupRoomMapping(user: IUserDocument) {
		const classGroups = await class_groupService.getAllGroups(user);
		const classRooms = await ClassRoom.find({ ownerId: user.id }).sort(
			'createdAt'
		);
		const mapping = new Map();
		classGroups.forEach((group) => {
			const filterRooms = classRooms.filter(
				(room) =>
					room.classRoomGroupId && room.classRoomGroupId.equals(group._id)
			);
			mapping.set(JSON.stringify(group), filterRooms);
		});

		const freeClassRooms = classRooms.filter(
			(room) => !room.classRoomGroupId
		);
		mapping.set(null, freeClassRooms);
		const results = [];
		for (const [key, value] of mapping) {
			results.push({
				group: !key ? null : JSON.parse(key),
				classRooms: value,
			});
		}
		return results;
	}

	async createNewRoom(user: IUserDocument, payload: object) {
		return await ClassRoom.create({
			...payload,
			ownerId: user._id,
		});
	}

	async updateRoom(
		id: string,
		user: IUserDocument,
		payload: any
	): Promise<IClassRoomDocument | null> {
		const classRoom = await ClassRoom.findById(id).orFail(
			() => new HttpError(_404, 404, ERROR_NOT_FOUND)
		);
		if (user.id !== classRoom.ownerId.toString()) {
			throw new HttpError(_403, 403, ERROR_FORBIDDEN);
		}
		if (payload.hasOwnProperty('_id')) {
			delete payload['_id'];
		}
		return await classRoom.updateOne(
			{ classRoomGroupId: null, ...payload },
			{ new: true }
		);
	}

	async deleteRoom(id: string, user: IUserDocument) {
		const classRoom = await ClassRoom.findById(id).orFail(
			() => new HttpError(_404, 404)
		);
		if (!classRoom.ownerId.equals(user._id)) {
			throw new HttpError(_403, 403, ERROR_FORBIDDEN);
		}
		await ClassRoom.deleteById(id);
	}
}

export default new ClassRoomService();
