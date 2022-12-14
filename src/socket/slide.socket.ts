import Slide, { ISlideDocument } from '../models/slides.model';

import Assignment from '../models/assignment.model';
import Library from '../models/library.model';
import SlideStream from '../models/slides_stream.model';
import { Socket } from 'socket.io';
import RosterGroup from '../models/roster_group.model';
import AssignmentWork from '../models/assignment_work.model';

const joinSlide = (socket: Socket, slide: ISlideDocument) => {
	socket.join(slide.id);
};

const slideSocket = (socket: Socket) => {
	let currentSlideId = null;
	console.log('Welcome to slide namspace');

	socket.on('join', async (slideId: string) => {
		const slide = await Slide.findById(slideId);
		if (slide) {
			currentSlideId = slide;
			joinSlide(socket, slide);
		}
	});

	socket.on('join-assign', async (rosterGroupId: string) => {
		const rosterGroup = await RosterGroup.findById(rosterGroupId);
		if (rosterGroup) {
			socket.join(rosterGroup.id);
		}
	});

	socket.on('edit', async (payload: any, id: string) => {
		console.log('emiiting ' + new Date().getTime());
		socket.broadcast.to(id).emit('updated', payload);
	});

	socket.on('save', async (payload: any, id: string) => {
		console.log('prev save');
		const slide = await Slide.findByIdAndUpdate(id, payload, { new: true });
		const assignmentId = slide.assignment;
		const assignment = await Assignment.findById(assignmentId);
		if (assignment && assignment.access === 'shared') {
			await SlideStream.findOneAndUpdate({ slide: slide._id }, payload);
		}
	});

	socket.on('save-lib', async (payload: any, userId: string) => {
		console.log('prev save library');
		if (Array.isArray(payload)) {
			await Library.create(
				payload.map((item) => ({ ...item, user: userId }))
			);
		} else {
			await Library.create({ ...payload, user: userId });
		}
	});

	socket.on(
		'raiseHand',
		async (assignWorkId: string, slideId: string, userId: string) => {
			console.log('raiseHand comming...', slideId, userId);
			const assignWork = await AssignmentWork.findById(assignWorkId);
			if (assignWork) {
				socket.broadcast
					.to(assignWork.rosterGroupId.toString())
					.emit('raiseHand', slideId, userId);
			}
		}
	);
};

export default slideSocket;
