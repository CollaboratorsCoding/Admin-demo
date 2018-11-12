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
	case `${types.EDIT_USERS}_START`:
		return {
			...state,
			loading: true,
			error: {},
		};
	case `${types.EDIT_USERS}_COMPLETED`: {
		// console.log(action.payload.user)
		const newData = [...state.users[action.payload.data.page]];
		const EditUsersPage = newData.map((user) => {
			if(user.key === action.payload.data.user.key) return action.payload.data.user
			return user
		})
		return {
			...state,
			loading: false,
			users: {
				...state.users,  [action.payload.data.page]: EditUsersPage
			},
			page: action.payload.data.page,
			user: action.payload.data.currentUser ? action.payload.data.currentUser : state.user,
			error: {},
		};
	}	
	case `${types.EDIT_USERS}_FAILED`:
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

	case `${types.REMOVE_USERS}_START`:
		return {
			...state,
			loading: true,
			error: {},
		};
	case `${types.REMOVE_USERS}_COMPLETED`: {
		const usersData = state.users;
		const newUsersData = {}
		if(usersData[action.payload.data.page]) {
			usersData[action.payload.data.page] = usersData[action.payload.data.page].filter(user => user.key !== action.payload.data.key)

			if(action.payload.data.userObject) {
				usersData[action.payload.data.page][usersData[action.payload.data.page].length] = action.payload.data.userObject
			}

			if (!usersData[action.payload.data.page][0]) {
				if (action.payload.data.page !== 1) {
					delete usersData[action.payload.data.page]
				}
				if (action.payload.data.page === 1) usersData[1] = []
			}
		}
		
		return {
			...state,
			loading: false,
			users: usersData[action.payload.data.page] ? {
				...newUsersData,  [action.payload.data.page]: usersData[action.payload.data.page]
			} : usersData,
			counts: state.counts-1,
			page: action.payload.data.page,
			error: {},
		};
	}	
	case `${types.REMOVE_USERS}_FAILED`:
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
