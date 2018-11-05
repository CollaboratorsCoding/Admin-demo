import { combineReducers } from "redux";
import UserReducer from './user/reducer';
import MsgReducer from './msg/reducer';
import socketReducer from './socket/reducer';

const rootReducer = combineReducers({
	user: UserReducer,
	msg: MsgReducer,
	socket: socketReducer,
});

export default rootReducer;