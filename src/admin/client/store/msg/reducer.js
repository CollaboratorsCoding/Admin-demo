import _ from 'lodash';
import messageType from './types';

function MsgReducer(
	state = {
		messages: [],
		loading: false,
		unreadCount: 0,
		readCount: 0,
	},
	action
) {
	switch (action.type) {
	case `${messageType.GET_MESSAGES}_START`:
		return {
			...state,
			loading: true,
		};
	case `${messageType.GET_MESSAGES}_COMPLETED`: {
		const newMessages = [
			...(state.messages.length <= 3 ? [] : state.messages),
			...action.payload.data.messages,
		];
		return {
			...state,
			loading: false,
			messages: newMessages,
			unreadCount: action.payload.data.unreadCount || 0,
			readCount: action.payload.data.readCount || 0,
		};
	}

	case `${messageType.GET_MESSAGES}_FAILED`:
		return {
			...state,
			loading: false,
		};

	case `${messageType.GET_MSG_SOCKET}`: {
		let messages = [action.payload, ...state.messages];
		if (state.messages.length >= 20 && state.messages.length % 20 === 0) {
			messages = messages.slice(0, -1);
		}
		return {
			...state,
			messages,
			unreadCount: state.unreadCount + 1,
		};
	}
	case `${messageType.CHANGE_MSG_READ}_COMPLETED`: {
		const messageIndex = _.findIndex(
			state.messages,
			msg => msg._id === action.payload.data.message._id
		);
		const newArray = state.messages.map((message, index) => {
			if (index === messageIndex) {
				return action.payload.data.message;
			}
			return message;
		});
		return {
			...state,
			messages: newArray,
			unreadCount: state.unreadCount - 1,
			readCount: state.readCount + 1,
		};
	}

	default:
		return state;
	}
}

export default MsgReducer;
