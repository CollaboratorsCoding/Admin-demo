import _ from 'lodash';
import types from './types';

function UserReducer(
	state = {
		checkedAuth: false,
		isLoggedIn: false,
		user: {},
		users: {},
		loadingUserState: true,
		error: {},
		loading: false,
		requestSuccess: {},
	},
	action
) {
	switch (action.type) {
	case `${types.GET_USER}_START`:
		return {
			...state,
			error: {},
		};
	case `${types.GET_USER}_COMPLETED`:
		return {
			...state,
			user: _.get(action.payload, 'data.user', {}),
			loadingUserState: false,
			checkedAuth: true,
			isLoggedIn: _.get(action.payload, 'data.isLoggedIn', true),
			error: {},
		};
	case `${types.GET_USER}_FAILED`:
		return {
			...state,
			error: {
				type: _.get(action.payload, 'response.data.type', 'server'),
				message: _.get(
					action.payload,
					'response.data.message',
					'Oops... Something went wrong 😔'
				),
				formData: _.get(
					action.payload,
					'response.data.formData',
					{}
				),
			},
			loadingUserState: false,
			checkedAuth: true,
			isLoggedIn: _.get(
				action.payload,
				'response.data.isLoggedIn',
				false
			),
		};
	case `${types.GET_USERS}_START`:
		return {
			...state,
			loading: true,
			error: {},
		};
	case `${types.GET_USERS}_COMPLETED`: {
		const newUsers = {
			...state.users,  [action.payload.data.page]: action.payload.data.users
		}

		return {
			...state,
			loading: false,
			users: newUsers,
			counts: action.payload.data.counts,
			page: action.payload.data.page,
			error: {},
		};
	}	
	case `${types.GET_USERS}_FAILED`:
		return {
			...state,
			loading: false,
			error: {
				type: _.get(action.payload, 'response.data.type', 'server'),
				message: _.get(
					action.payload,
					'response.data.message',
					'Oops... Something went wrong 😔'
				),
				formData: _.get(
					action.payload,
					'response.data.formData',
					{}
				),
			},
			loadingUserState: false,
			checkedAuth: true,
			isLoggedIn: _.get(
				action.payload,
				'response.data.isLoggedIn',
				false
			),
		};
	case `${types.CREATE_USER}_START`:
		return {
			...state,
			loading: true,
			error: {},
		};
	case `${types.CREATE_USER}_COMPLETED`:
		window.location.reload(true);
		return state
	case `${types.CREATE_USER}_FAILED`:
		return {
			...state,
			error: {
				type: _.get(action.payload, 'response.data.type', 'server'),
				message: _.get(
					action.payload,
					'response.data.message',
					'Oops... Something went wrong 😔'
				),
				formData: _.get(
					action.payload,
					'response.data.formData',
					{}
				),
			},
			loading: false,
		};
	case `${types.EDIT_USER}_START`:
		return {
			...state,
			loading: true,
			error: {},
			requestSuccess: {},
		};
	case `${types.EDIT_USER}_COMPLETED`:
		return {
			...state,
			user: _.get(action.payload, 'data.user', {}),
			requestSuccess: _.get(action.payload, 'data.requestSuccess', {
				operation: 'generic',
				message: 'Success. Operation Completed',
			}),
			loading: false,
			error: {},
		};
	case `${types.EDIT_USER}_FAILED`:
		return {
			...state,
			user: {},
			error: {
				type: _.get(action.payload, 'response.data.type', 'server'),
				message: _.get(
					action.payload,
					'response.data.message',
					'Oops... Something went wrong 😔'
				),
				formData: _.get(
					action.payload,
					'response.data.formData',
					{}
				),
			},
			isLoggedIn: _.get(
				action.payload,
				'response.data.isLoggedIn',
				false
			),
			loading: false,
		};
	case `${types.LOGIN_USER}_START`:
		return {
			...state,
			error: {},
			loading: true,
		};
	case `${types.LOGIN_USER}_COMPLETED`:
		window.location.reload(true);
		return state
	case `${types.LOGIN_USER}_FAILED`:
		return {
			...state,
			error: {
				type: _.get(action.payload, 'response.data.type', 'server'),
				message: _.get(
					action.payload,
					'response.data.message',
					'Oops... Something went wrong 😔'
				),
				formData: _.get(
					action.payload,
					'response.data.formData',
					{}
				),
			},
			loading: false,
		};
	case `${types.LOGOUT_USER}_START`:
		return {
			...state,
			loading: true,
			error: {},
			requestSuccess: {},
		};
	case `${types.LOGOUT_USER}_COMPLETED`:
		window.location.reload(true);
		return state
	case `${types.LOGOUT_USER}_FAILED`:
		return {
			...state,
			loading: false,
			requestSuccess: {},
			isLoggedIn: _.get(
				action.payload,
				'response.data.isLoggedIn',
				false
			),
			error: {
				type: _.get(action.payload, 'response.data.type', 'server'),
				message: _.get(
					action.payload,
					'response.data.message',
					'Oops... Something went wrong 😔'
				),
				formData: _.get(
					action.payload,
					'response.data.formData',
					{}
				),
			},
		};
	case `${types.RESTORE_PASSWORD_USER}_START`:
		return {
			...state,
			loading: true,
			requestSuccess: {},
			error: {},
		};
	case `${types.RESTORE_PASSWORD_USER}_COMPLETED`:
		return {
			...state,
			error: {},
			loading: false,
			requestSuccess: _.get(action.payload, 'data.requestSuccess', {
				operation: 'generic',
				message: 'Success. Operation Completed',
			}),
		};
	case `${types.RESTORE_PASSWORD_USER}_FAILED`:
		return {
			...state,
			loading: false,
			requestSuccess: {},
			error: {
				type: _.get(action.payload, 'response.data.type', 'server'),
				message: _.get(
					action.payload,
					'response.data.message',
					'Oops... Something went wrong 😔'
				),
				formData: _.get(
					action.payload,
					'response.data.formData',
					{}
				),
			},
		};
	case `${types.UPLOAD_IMAGE_USER}_START`:
		return {
			...state,
			loading: true,
			requestSuccess: {},
			error: {},
		};
	case `${types.UPLOAD_IMAGE_USER}_COMPLETED`:
		return {
			...state,
			error: {},
			loading: false,
			user: action.payload.data.user,
			requestSuccess: _.get(action.payload, 'data.requestSuccess', {
				operation: 'generic',
				message: 'Success. Operation Completed',
			}),
		};
	case `${types.UPLOAD_IMAGE_USER}_FAILED`:
		return {
			...state,
			loading: false,
			requestSuccess: {},
			error: {
				type: _.get(action.payload, 'response.data.type', 'server'),
				message: _.get(
					action.payload,
					'response.data.message',
					'Oops... Something went wrong 😔'
				),
				formData: _.get(
					action.payload,
					'response.data.formData',
					{}
				),
			},
		};
	case `${types.DELETE_IMAGE_USER}_START`:
		return {
			...state,
			loading: true,
			requestSuccess: {},
			error: {},
		};
	case `${types.DELETE_IMAGE_USER}_COMPLETED`:
		return {
			...state,
			error: {},
			loading: false,
			user: action.payload.data.user,
			requestSuccess: _.get(action.payload, 'data.requestSuccess', {
				operation: 'generic',
				message: 'Success. Operation Completed',
			}),
		};
	case `${types.DELETE_IMAGE_USER}_FAILED`:
		return {
			...state,
			loading: false,
			requestSuccess: {},
			error: {
				type: _.get(action.payload, 'response.data.type', 'server'),
				message: _.get(
					action.payload,
					'response.data.message',
					'Oops... Something went wrong 😔'
				),
				formData: _.get(
					action.payload,
					'response.data.formData',
					{}
				),
			},
		};
	default:
		return state;
	}
}

export default UserReducer;
