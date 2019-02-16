import _ from 'lodash';
import UpdateStatus from '../auth/action';

const authMiddleware = ({ dispatch }) => next => action => {
	const SuccessIsLoggedIn = _.get(
		action.payload, 'data.isLoggedIn', undefined
	);
	const FailureIsLoggedIn = _.get(
		action.payload, 'response.data.isLoggedIn', undefined
	);
	if (
		typeof SuccessIsLoggedIn !== 'undefined'
		||
		typeof FailureIsLoggedIn !== 'undefined'
	) {
		UpdateStatus(
			dispatch,
			typeof SuccessIsLoggedIn !== 'undefined'
				? SuccessIsLoggedIn
				: FailureIsLoggedIn
		)
	}
	next(action);
}

export default authMiddleware