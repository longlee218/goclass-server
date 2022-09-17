import Notify from '../models/notify.model';
import { Socket } from 'socket.io';
import { StudentClassRoom } from '../models';

const notifySocket = (socket: Socket) => {
	let currentSlideId = null;
	console.log('Welcome to notify namspace');

	socket.on('join', async (userId: string) => {
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
};

export default notifySocket;
