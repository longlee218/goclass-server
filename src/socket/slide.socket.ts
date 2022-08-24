import Slide, { ISlideDocument } from '../models/slides.model';

import { Socket } from 'socket.io';

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

	socket.on('edit', async (payload: any, id: string) => {
		console.log('emiiting ' + new Date().getTime());
		await Slide.findByIdAndUpdate(id, payload);
	});

	socket.on('update', (payload: any, id: string) => {
		socket.broadcast.to(id).emit('updated', payload);
	});

	socket.on('save', async (payload: any, id: string) => {});
};

export default slideSocket;
