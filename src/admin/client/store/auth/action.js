import type from './types';

const UpdateStatus = (dispatch, authStatus) =>
	dispatch({
		type: type.AUTH_UPDATE_STATUS,
		isLoggedIn: authStatus,
	});

export default UpdateStatus;