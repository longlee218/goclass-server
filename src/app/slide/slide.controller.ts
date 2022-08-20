import { NextFunction, Request, Response } from 'express';

import Assignment from '../../models/assignment.model';
import BaseController from '../../core/base.controller';
import HttpResponse from '../../utils/HttpResponse';
import Slide from '../../models/slides.model';
import { Types } from 'mongoose';

export class SlideController extends BaseController {
	async find(req: Request, res: Response, next: NextFunction) {
		const slideId = req.params.id;
		const slide = await Slide.findById(slideId);
		return new HttpResponse({ res, data: slide });
	}

	async update(req: Request, res: Response, next: NextFunction) {
		const slideId = req.params.id;
		const slideUpdated = await Slide.findByIdAndUpdate(slideId, req.body, {
			new: true,
		});
		return new HttpResponse({ res, data: slideUpdated });
	}

	async init(req: Request, res: Response, next: NextFunction) {
		const assignmentId = req.body.assignmentId;
		const assignment = await Assignment.findById(assignmentId);
		const slide = await Slide.create({
			assignment,
			name: 'Slide ' + (assignment.slideCounts + 1),
			order: assignment.slideCounts + 1,
		});
		await assignment.onAddNewSlide(slide._id);
		return new HttpResponse({ res, data: slide });
	}

	async duplicate(req: Request, res: Response, next: NextFunction) {
		const slide = await Slide.findById(req.params.id);
		const assignment = await Assignment.findById(slide.assignment);
		const numSlides = assignment.slideCounts;
		const newSlide = await Slide.create({
			...assignment.toJSON(),
			_id: undefined,
			assignment: assignment._id,
			order: numSlides + 1,
		});
		await assignment.onAddNewSlide(newSlide._id);
		return new HttpResponse({ res, data: newSlide });
	}

	async changeOrder(req: Request, res: Response, next: NextFunction) {
		const id = req.params.id;
		const { order } = req.body;
		const slide = await Slide.findById(id);
		const currentOrder = Number(slide.order);
		const changeOrder = Number(order);
		if (currentOrder === changeOrder) {
			return res.sendStatus(204);
		}
		if (currentOrder < changeOrder) {
			await Slide.updateMany(
				{
					assignment: slide.assignment,
					order: { $gt: currentOrder, $lte: changeOrder },
				},
				{
					$inc: { order: -1 },
				}
			);
		}
		if (currentOrder > changeOrder) {
			await Slide.updateMany(
				{
					assignment: slide.assignment,
					order: { $lt: currentOrder, $gte: changeOrder },
				},
				{
					$inc: { order: 1 },
				}
			);
		}
		slide.order = changeOrder;
		await slide.save();
		return res.sendStatus(204);
	}
}

export default new SlideController();
