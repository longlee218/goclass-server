import Notify from '../models/notify.model';
import RosterGroup from '../models/roster_group.model';
import { Socket } from 'socket.io';
import { StudentClassRoom } from '../models';

const notifySocket = (socket: Socket) => {
	console.log('Welcome to notify namspace');
	socket.on('join', (userId: string) => {
		socket.join(userId);
	});

	socket.on(
		'notify-class',
		async (
			classRoom: string,
			className: string,
			userId: string,
			userFullname: string,
			linkTo: string
		) => {
			const students = await StudentClassRoom.find({ classRoom });
			const recievers = students.map((student) =>
				student.student.toString()
			);
			const notify = await Notify.create({
				content: `<span className='name' style="font-weight: 600">${userFullname}</span>&nbsp;&nbsp;đã đăng 1 thông báo mới trong lớp ${className}`,
				type: 'app/models/user.model',
				linkTo: linkTo,
				recievers,
				createdBy: userId,
			});
			socket.broadcast.to(recievers).emit('notify', {
				...notify.toJSON(),
				createdBy: {
					_id: userId,
					fullname: userFullname,
				},
			});
		}
	);

	socket.on(
		'notify-roster',
		async (
			rosterGroupId: string,
			rosterGroupName: string,
			userId: string,
			userFullname: string,
			linkTo: string
		) => {
			const rosterGroup = await RosterGroup.findById(rosterGroupId).populate(
				{
					path: 'students',
					populate: {
						path: 'student',
						select: '_id',
						options: {
							justOne: true,
						},
					},
				}
			);
			const recievers = rosterGroup.students.map((std: any) =>
				std.student._id.toString()
			);
			console.log(rosterGroup.students, recievers);
			const notify = await Notify.create({
				content: `<span className='name' style="font-weight: 600">${userFullname}</span>&nbsp;&nbsp;vừa gán bạn vào nhóm thi ${rosterGroupName}`,
				type: 'app/models/user.model',
				linkTo: linkTo,
				recievers,
				createdBy: userId,
			});
			socket.broadcast.to(recievers).emit('notify', {
				...notify.toJSON(),
				createdBy: {
					_id: userId,
					fullname: userFullname,
				},
			});
		}
	);
};

export default notifySocket;
