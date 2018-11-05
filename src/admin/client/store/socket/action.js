import socketType from './types';

const SocketActions = {};

SocketActions.connectSocket = () => ({
	  type: 'socket',
	types: [
		`${socketType.CONNECT_SOCKET}_START`,
		`${socketType.CONNECT_SOCKET}_SUCCESS`,
		`${socketType.CONNECT_SOCKET}_FAIL`
	],
	  promise: socket => socket.connect(),
})
  
SocketActions.disconnectSocket = () => ({
	  type: 'socket',
	  types: [
		`${socketType.DISCONNECT_SOCKET}_START`,
		`${socketType.DISCONNECT_SOCKET}_SUCCESS`,
		`${socketType.DISCONNECT_SOCKET}_FAIL`
	],
	  promise: socket => socket.disconnect(),
})

export default SocketActions;