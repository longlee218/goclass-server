import BaseService from '../../core/base.service';
import { EnumStatusRoster } from '../../config/enum';
import RosterGroup from '../../models/roster_group.model';
import { Types } from 'mongoose';

class ExamService extends BaseService {
	async findStudentInOtherGroup(
		rosterId: Types.ObjectId,
		studentIds: Array<Types.ObjectId>
	): Promise<Array<Types.ObjectId>> {
		const rosterGroups = await RosterGroup.find({
			status: EnumStatusRoster.Online,
			roster: rosterId,
		});
		const listStudents: Array<Types.ObjectId> = rosterGroups.reduce(
			(prev, current) => {
				prev = [...prev, ...current.students];
				return prev;
			},
			[]
		);
		return listStudents.filter((alreadyId) =>
			studentIds.filter((studentId) => studentId.equals(alreadyId))
		);
	}
}

export default new ExamService();
