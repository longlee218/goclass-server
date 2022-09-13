import Assignment, { IAssignmentDocument } from '../../models/assignment.model';

import { AssignmentFolder } from '../../models';
import { EnumStatusRoster } from '../../config/enum';
import { IUserDocument } from '../../models/user.model';
import Roster from '../../models/roster.model';
import Slide from '../../models/slides.model';
import { Types } from 'mongoose';

export class AssignmentService {
	async createFolder(
		name: string,
		parentId: string | null,
		user: IUserDocument
	) {
		const folder = parentId
			? await AssignmentFolder.findById(parentId)
			: null;
		const listName = name.split(',');
		const payload = listName
			.filter((e) => e)
			.map((name) => ({
				name,
				parentId: parentId || null,
				owner: user._id,
				belongs: folder ? [...folder.belongs, folder._id] : [],
			}));
		return await AssignmentFolder.create(payload);
	}

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
			assignments = await Assignment.find({
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
			assignments = await Assignment.find({
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

	async initBlankAssignment(parentId: string | null, user: IUserDocument) {
		const folder = parentId
			? await AssignmentFolder.findOne({
					_id: parentId,
					owner: user._id,
			  })
			: null;
		const assignId = new Types.ObjectId();
		const listSlideData = [...Array(4).keys()].map(
			(_: unknown, i: number) => ({
				_id: new Types.ObjectId(),
				name: 'Slide ' + (i + 1),
				background: '',
				content: '',
				sticker: '',
				work: '',
				order: i + 1,
				points: 0,
				assignment: assignId,
			})
		);
		await Slide.create(listSlideData);
		const roster = await Roster.create({
			status: EnumStatusRoster.Offline,
			assignment: assignId,
		});
		const assignment = await Assignment.create({
			_id: assignId,
			name: 'Bài tập mới',
			owner: user._id,
			parentId: parentId || null,
			slideCounts: listSlideData.length,
			slides: listSlideData.map(({ _id }) => _id),
			belongs: folder ? [...folder.belongs, folder._id] : [],
			roster: roster._id,
		});

		return assignment;
	}

	async findAssignmentById(id: string) {
		return await Assignment.findById(id)
			.populate('owner')
			.populate({
				path: 'slides',
				options: {
					sort: 'order',
				},
			});
	}

	async updateById(payload: any, id: string) {
		return await Assignment.findByIdAndUpdate(id, payload, { new: true });
	}

	async deleteById(id: string) {
		return await Assignment.findByIdAndDelete(id);
	}

	async copyAssignment(
		id: string,
		user: IUserDocument
	): Promise<IAssignmentDocument> {
		const { assignmentData, listSlideData } =
			await this.makeCopyAssignmentData(id, user);
		await Slide.create(listSlideData);
		return await Assignment.create(assignmentData);
	}

	async makeCopyAssignmentData(
		id: string | Types.ObjectId,
		user: IUserDocument,
		suffixName: string = ' (copy)'
	) {
		const assignment = await Assignment.findByIdOrFail(id, user);
		const assignId = new Types.ObjectId();
		const slides = await Slide.find({ assignment: assignment._id });
		const listSlideData = slides.map((slide) => ({
			...slide.toJSON(),
			_id: new Types.ObjectId(),
			assignment: assignId,
		}));
		const assignmentData = {
			_id: assignId,
			name: assignment.name + suffixName,
			subjects: assignment.subjects,
			grades: assignment.grades,
			desc: assignment.desc,
			permissions: assignment.permissions,
			slideCounts: assignment.slideCounts,
			parentId: assignment.parentId,
			owner: assignment.owner,
			belongs: assignment.owner,
			slides: listSlideData.map(({ _id }) => _id),
		};
		return { listSlideData, assignmentData };
	}

	async getSharedAssignments() {
		const results = await Assignment.find({ access: 'shared' });
		return results;
	}
}

export default new AssignmentService();
