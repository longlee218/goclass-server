import { Types } from 'mongoose';

export default class BaseService {
	makeQuery(payload: any) {
		const query: any = {};
		Object.keys(payload).forEach((key) => {
			const value = payload[key];
			if (value && !key.includes('.')) {
				if (Array.isArray(value)) {
					query[key] = { $in: value };
				} else if (
					typeof value === 'string' &&
					(value === 'true' || value === 'false')
				) {
					query[key] = JSON.parse(value);
				} else if (
					typeof value === 'string' &&
					Types.ObjectId.isValid(value)
				) {
					query[key] = new Types.ObjectId(value);
				} else if (typeof value === 'string' && !isNaN(Number(value))) {
					query[key] = value;
				} else if (typeof value === 'string' && key === 'gender') {
					query[key] = value;
				} else if (typeof value === 'string') {
					query[key] = {
						$regex: new RegExp(value),
						$options: 'i',
					};
				}
			}
		});
		return query;
	}
}
