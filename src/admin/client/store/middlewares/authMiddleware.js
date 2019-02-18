import _ from 'lodash';
import UpdateStatus from '../auth/action';

const authMiddleware = ({ dispatch }) => next => action => {
	const IsLoggedIn = _.get(
		action.payload, 'data.isLoggedIn', undefined
	) || _.get(
		action.payload, 'response.data.isLoggedIn', undefined
	)
	if (
		typeof IsLoggedIn !== 'undefined'
	) {
		UpdateStatus(
			dispatch,
			IsLoggedIn
		)
	}
	next(action);
}

export default authMiddleware