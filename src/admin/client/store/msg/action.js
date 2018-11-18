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



MessageActions.sendMessage = data => (
	{
		type: 'socket',
		types: [
			`${messageType.SEND_MESSAGE}_START`, 
			`${messageType.SEND_MESSAGE}_SUCCESS`, 
			`${messageType.SEND_MESSAGE}_FAIL`
		],
		promise: socket => socket.emit('message_send', data)
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
