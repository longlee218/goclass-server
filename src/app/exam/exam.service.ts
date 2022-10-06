import AssignmentWork from '../../models/assignment_work.model';
import BaseService from '../../core/base.service';
import { CLIENT_HOST_EDITOR } from '../../config/key';
import { EnumStatusRosterGroup } from '../../config/enum';
import { ISlideDocument } from '../../models/slides.model';
import { IUserDocument } from '../../models/user.model';
import RosterGroup from '../../models/roster_group.model';
import { Types } from 'mongoose';
import { generateEncryptionKey } from '../../utils/Encryption';
import { saveToFirebase } from '../../utils/Firebase';

class ExamService extends BaseService {
	async findStudentInOtherGroup(
		rosterId: Types.ObjectId,
		studentIds: Array<Types.ObjectId>
	): Promise<Array<Types.ObjectId>> {
		const rosterGroups = await RosterGroup.find({
			status: EnumStatusRosterGroup.Ready,
			roster: rosterId,
		});
		const listStudents: Array<Types.ObjectId> = rosterGroups.reduce(
			(prev, current) => {
				prev = [...prev, ...current.students];
				return prev;
			},
			[]
		);
		return listStudents.filter(
			(alreadyId) =>
				studentIds.filter(
					(studentId) => alreadyId.toString() === studentId.toString()
				).length
		);
	}

	async getExam(studentIds: string[], isTodo: boolean) {
		const groups = await RosterGroup.aggregate([
			{
				$match: {
					students: { $elemMatch: { $in: studentIds } },
					...(isTodo
						? {
								$or: [
									{
										status: EnumStatusRosterGroup.Ready,
									},
									{
										status: EnumStatusRosterGroup.Online,
									},
								],
						  }
						: {
								status: EnumStatusRosterGroup.Finished,
						  }),
				},
			},
			{
				$lookup: {
					from: 'rosters',
					let: {
						localField: '$roster',
					},
					pipeline: [
						{
							$match: {
								$expr: { $eq: ['$$localField', '$_id'] },
							},
						},
						{
							$limit: 1,
						},
					],
					as: 'roster',
				},
			},
			{
				$unwind: {
					path: '$roster',
					preserveNullAndEmptyArrays: false,
				},
			},
			{
				$lookup: {
					from: 'assignments',
					let: {
						localField: '$roster.assignment',
					},
					pipeline: [
						{
							$match: {
								$expr: { $eq: ['$$localField', '$_id'] },
							},
						},
						{
							$sort: {
								createdAt: -1,
							},
						},
					],
					as: 'assignment',
				},
			},
			{
				$lookup: {
					from: 'users',
					localField: 'owner',
					foreignField: '_id',
					as: 'owner',
				},
			},
			{
				$unwind: {
					path: '$owner',
					preserveNullAndEmptyArrays: false,
				},
			},
			{
				$lookup: {
					from: 'class_rooms',
					localField: 'classRoom',
					foreignField: '_id',
					as: 'classRoom',
				},
			},
			{
				$unwind: {
					path: '$classRoom',
					preserveNullAndEmptyArrays: false,
				},
			},
			{
				$group: {
					_id: '$classRoom._id',
					rosterGroups: {
						$push: {
							_id: '$_id',
							name: '$name',
							isBlock: '$isBlock',
							isCanHelp: '$isCanHelp',
							isHide: '$isHide',
							isSuffer: '$isSuffer',
							isFull: '$isFull',
							isShowResult: '$isShowResult',
							status: '$status',
							assignment: { $first: '$assignment' },
							createdAt: '$createdAt',
							updatedAt: '$updatedAt',
						},
					},
					owner: { $first: '$owner' },
					roster: { $first: '$roster' },
					classRoom: { $first: '$classRoom' },
				},
			},
			{
				$project: {
					_id: 1,
					rosterGroups: 1,
					'owner._id': 1,
					'owner.fullname': 1,
					'owner.email': 1,
					'owner.roles': 1,
					'owner.lastLogin': 1,
					'classRoom._id': 1,
					'classRoom.name': 1,
				},
			},
		]);
		return groups;
	}
	makeLinkEditor(
		slideId: string,
		encryptKey: string,
		assignWorkId: string,
		userId: string
	) {
		return (
			CLIENT_HOST_EDITOR +
			`/#room=${slideId},${encryptKey},${assignWorkId},${userId}`
		);
	}
	async makeDataSlideToFirebase(
		slides: Array<ISlideDocument>,
		rosterGroupId: Types.ObjectId,
		user: IUserDocument
	) {
		const assignWork = await AssignmentWork.findOne({
			assignmentId: slides[0].assignment,
			rosterGroupId: rosterGroupId,
			workBy: user._id,
		});
		const self = this;
		if (!assignWork) {
			const encryptKey = await generateEncryptionKey<'string'>();
			const promises = slides.map((slide) => {
				return saveToFirebase(
					{
						roomId: slide.id,
						roomKey: encryptKey,
					},
					slide.elements,
					slide.appState
				);
			});
			return Promise.all(promises)
				.then(() => {
					return AssignmentWork.create({
						encryptKey: encryptKey,
						assignmentId: slides[0].assignment,
						rosterGroupId: rosterGroupId,
						slideIds: slides.map(({ _id }) => _id),
						workBy: user._id,
					});
				})
				.then((assignWork) => {
					return {
						...assignWork.toJSON(),
						link: self.makeLinkEditor(
							assignWork.slideIds[0].toString(),
							assignWork.encryptKey,
							assignWork._id.toString(),
							user.id
						),
					};
				});
		} else {
			return {
				...assignWork.toJSON(),
				link: self.makeLinkEditor(
					assignWork.slideIds[0].toString(),
					assignWork.encryptKey,
					assignWork._id.toString(),
					user.id
				),
			};
		}
	}
}

export default new ExamService();
