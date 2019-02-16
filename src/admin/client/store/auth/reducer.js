import authType from './types';

export default function authReducer(state = {
	isLoggedIn: false
}, action = {}) {
	switch (action.type) {
	case authType.AUTH_UPDATE_STATUS: 
		return {
			...state,
			isLoggedIn: action.isLoggedIn
		};
	  default:
		return state;
	}
}