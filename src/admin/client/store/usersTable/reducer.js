import _ from 'lodash';
import types from './types';

function UsersTableReducer(
	state = {
		users: {},
		error: {},
		counts: null,
		loading: false,
	},
	action
) {
	switch (action.type) {
	case types.CHANGE_PAGE:
		return {
			...state,
			page: action.page,
			error: {},
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
			}
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
		};
	default:
		return state;
	}
}

export default UsersTableReducer;
