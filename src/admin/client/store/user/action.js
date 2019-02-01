import axios from 'axios';
import types from './types';
import createActionThunk from '../actionThunk';

const UserActions = {};


UserActions.subscribeUserCounter = () => dispatch => {
	dispatch({
		type: 'socket',
		types: [
			'USER_COUNTER_SUBSCRIBE',
			'USER_COUNTER_SUBSCRIBE_SUCCESS',
			'USER_COUNTER_SUBSCRIBE_FAIL'
		],
		promise: (socket) => socket.on('user_counter', (usersCount) => dispatch({
			type: types.USER_SUBSCRIBE_COUNTER,
			payload: usersCount,
		})),
	});
}

UserActions.getCount = () => 
	(
		{
			type: 'socket',
			types: ['GET_COUNT', 'GET_COUNT_SUCCESS', 'GET_COUNT_FAIL'],
			promise: socket => socket.emit('get_count'),
		}
	)


UserActions.getUser = createActionThunk(types.GET_USER, () =>
	axios.get(`/api/profile`)
);

UserActions.createUser = createActionThunk(types.CREATE_USER, data =>
	axios.post(`/api/signup`, data)
);

UserActions.loginUser = createActionThunk(types.LOGIN_USER, data =>
	axios.post(`/api/signin`, data)
);

UserActions.editUser = createActionThunk(types.EDIT_USER, data =>
	axios.put(`/api/profile`, data)
);

UserActions.logoutUser = createActionThunk(types.LOGOUT_USER, () =>
	axios.get(`/api/logout`)
);

UserActions.changePasswordRestore = createActionThunk(
	types.RESTORE_PASSWORD_USER,
	(token, data) => axios.post(`/api/resetPassword?token=${token}`, data)
);

UserActions.sendResetLinkEmail = createActionThunk(
	types.RESTORE_PASSWORD_USER,
	data => axios.post(`/api/sendresetPassword`, data)
);
UserActions.uploadAvatar = createActionThunk(types.UPLOAD_IMAGE_USER, file =>
	axios.post(`/api/uploadAvatar`, file)
);
UserActions.deleteAvatar = createActionThunk(types.DELETE_IMAGE_USER, () =>
	axios.delete(`/api/deleteAvatar`)
);

export default UserActions;
