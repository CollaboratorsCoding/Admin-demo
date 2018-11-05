import socketType from './types';

export default function socketReducer(state = {}, action = {}) {
	switch (action.type) {
	  case `${socketType.CONNECT_SOCKET}_START`:
		return {
		  ...state,
		  isConnecting: true,
		};
	  case `${socketType.CONNECT_SOCKET}_SUCCESS`:
		return {
		  ...state,
		  isConnecting: false,
		  connectError: null,
		};
	  case `${socketType.CONNECT_SOCKET}_FAIL`:
		return {
		  ...state,
		  isConnecting: false,
		  connectError: action.error,
		};
	  case `${socketType.DISCONNECT_SOCKET}_START`:
		return {
		  ...state,
		  isDisconnecting: true,
		};
	  case `${socketType.DISCONNECT_SOCKET}_SUCCESS`:
		return {
		  ...state,
		  isDisconnecting: true,
		  disconnectError: null,
		};
	  case `${socketType.DISCONNECT_SOCKET}_FAIL`:
		return {
		  ...state,
		  isDisconnecting: false,
		  disconnectError: action.error,
		};
	  default:
		return state;
	}
}