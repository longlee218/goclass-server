export const ROUTES = {
	AUTH_REGISTER: '/auth/register',
	AUTH_LOGIN: '/auth/login',
	AUTH_LOGOUT: '/auth/logout',
	AUTH_GOOGLE: '/auth/google',
	AUTH_TOKEN: '/auth/token',
	AUTH_IS_LOGIN: '/auth/am_i_login',
	AUTH_GOOGLE_CALLBACK: '/auth/google/callback',

	USER_PROFILE: '/user/profile',
	USER_INFO: '/user/info/:id',

	CLASS_ROOM: '/class-room',
	CLASS_ROOM_DULIPATE: '/class-room-duplicate',
	CLASS_ROOM_NEW_SESSION: '/class-room-new-session',
	CLASS_ROOM_PARAM: '/class-room/:id',

	CLASS_GROUP: '/class-group',
	CLASS_GROUP_PARAM: '/class-group/:id',

	ASSIGNMENT_PARAM: '/assignment/:id',
	ASSIGNMENT_PARAM_DUPLICATE: '/assignment/:id/duplicate',
	ASSIGNMENT_CATEGORY: '/assign/category/:parentId?',
	ASSIGNMENT_CATEGORY_ID: '/assign-category/:id',
	ASSIGNMENT_BREADCRUMB: '/assign/breadcrumbs',

	ASSIGNMENT_INIT_BLANK: '/assign/init-blank/:parentId?',

	SLIDE: '/slide',
	SLIDE_PARAM: '/slide/:id',
	SLIDE_DUPLICATE: '/slide/:id/duplicate',
	SLIDE_CHANGE_ORDER: '/slide/:id/order',

	STUDENT: '/students',
	STUDENT_OF_CLASS: '/students-class:classId',
	STUDENT_OF_CLASS_PARAM: '/students-class:classId/:id',

	EXAM_NEW_ROSTER_GROUP: '/exam/roster/:id/roster-group',
	ROSTER_GROUP_PARAM: '/exam/roster-group/:id',

	EXAM_ANALYZE: '/exam/analyze',

	ORGANIZATION: '/organization',
	EMAIL: '/email',
	EMAIL_EXIST: '/email-exist',
};
