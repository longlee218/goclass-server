import { CLIENT_HOST } from '../config/key';
import passport from 'passport';

const authGoogle = passport.authenticate('google', {
	session: false,
	failureRedirect: CLIENT_HOST,
	failureMessage: 'Unauthorized',
});

export default authGoogle;
