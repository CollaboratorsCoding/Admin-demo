import { combineReducers } from "redux";
import UserReducer from './user/reducer';
import MsgReducer from './msg/reducer';
import socketReducer from './socket/reducer';
import UsersTableReducer from './usersTable/reducer';
import authReducer from './auth/reducer';

const rootReducer = combineReducers({
	user: UserReducer,
	auth: authReducer,
	msg: MsgReducer,
	socket: socketReducer,
	usersTable: UsersTableReducer
});

export default rootReducer;