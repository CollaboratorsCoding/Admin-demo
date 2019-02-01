import axios from 'axios';
import types from './types';
import createActionThunk from '../actionThunk';

const TableUsers = {};

TableUsers.changePage = (page) => dispatch => {
	dispatch({
		type: types.CHANGE_PAGE,
		page
	});
}
TableUsers.getUsers = createActionThunk(
	types.GET_USERS,
	(page, limit) => axios.get(`/api/users?q=${limit}&p=${page}`)
);

TableUsers.editUsers = createActionThunk(
	types.EDIT_USERS,
	(data, key, page) => axios.put(`/api/users?key=${key}&p=${page}`, data)
);

TableUsers.removeUsers = createActionThunk(
	types.REMOVE_USERS,
	(key, page) => axios.delete(`/api/users?key=${key}&p=${page}`)
);

export default TableUsers;
