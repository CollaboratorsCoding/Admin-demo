import { combineReducers } from "redux";
import UserReducer from './user/reducer';
import MsgReducer from './msg/reducer';
import socketReducer from './socket/reducer';
import UsersTableReducer from './usersTable/reducer';

const rootReducer = combineReducers({
	user: UserReducer,
	msg: MsgReducer,
	socket: socketReducer,
	usersTable: UsersTableReducer
});

export default rootReducer;