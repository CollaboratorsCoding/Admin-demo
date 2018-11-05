import axios from 'axios';
import messageType from './types';
import createActionThunk from '../actionThunk';

const MessageActions = {};

MessageActions.getMessages = createActionThunk(
	messageType.GET_MESSAGES,
	(limit, offset) => axios.get(`/api/messages?q=${limit}&o=${offset}`)
);
MessageActions.handleReadChange = createActionThunk(
	messageType.CHANGE_MSG_READ,
	data => axios.put(`/api/messages`, data)
);

MessageActions.subscribeUserCounter = () => dispatch => {
	dispatch({
	  type: 'socket',
	  types: [
		  'USER_COUNTER_SUBSCRIBE',
		  'USER_COUNTER_SUBSCRIBE_SUCCESS',
		  'USER_COUNTER_SUBSCRIBE_FAIL'
		],
	  promise: (socket) => socket.on('user_counter', (usersCount) => dispatch({
		  type: messageType.USER_SUBSCRIBE_COUNTER,
		  payload: usersCount,
	  })),
	});
}

MessageActions.getCount = () => 
	(
		{
			type: 'socket',
			types: ['GET_COUNT', 'GET_COUNT_SUCCESS', 'GET_COUNT_FAIL'],
			promise: socket => socket.emit('get_count'),
		}
	)


MessageActions.subscribeMessages = () => dispatch => {
	  dispatch({
		type: 'socket',
		types: ['RECEIVE', 'RECEIVE_SUCCESS', 'RECEIVE_FAIL'],
		promise: (socket) => socket.on('message_receive', (message) => dispatch({
			type: messageType.GET_MSG_SOCKET,
			payload: message,
		})),
	  });
}


export default MessageActions;
