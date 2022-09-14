import BaseService from '../../core/base.service';
import { EnumStatusRosterGroup } from '../../config/enum';
import RosterGroup from '../../models/roster_group.model';
import { Types } from 'mongoose';

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

	async getToDoExam(studentIds: string[]) {
		const groups = await RosterGroup.aggregate([
			{
				$match: {
					students: { $elemMatch: { $in: studentIds } },
					$or: [
						{
							status: EnumStatusRosterGroup.Ready,
						},
						{
							status: EnumStatusRosterGroup.Online,
						},
					],
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
			// {
			// 	$lookup: {
			// 		from: 'assignment_streams',
			// 		let: {
			// 			localField: '$roster.assignmentStream',
			// 		},
			// 		pipeline: [
			// 			{
			// 				$match: {
			// 					$expr: { $eq: ['$$localField', '$_id'] },
			// 				},
			// 			},
			// 			{
			// 				$sort: {
			// 					createdAt: -1,
			// 				},
			// 			},
			// 		],
			// 		as: 'assignmentStream',
			// 	},
			// },
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
}

export default new ExamService();
