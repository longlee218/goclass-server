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
}

export default new ExamService();
