import { CorsOptions } from 'cors';

const corsOptions: CorsOptions = {
	credentials: true,
	methods: ['GET', 'POST', 'OPTIONS', 'DELETE', 'PUT', 'PATCH'],
	origin: 'http://localhost:3000',
};
export default corsOptions;
