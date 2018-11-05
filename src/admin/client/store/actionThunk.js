/**
 * creates thunk from promiseCreator
 * @param {string} actionType
 * @param {() => Promise<*>} promiseCreator
 */
export default function createActionThunk(actionType, promiseCreator) {
	return (...params) => async dispatch => {
		dispatch({ type: `${actionType}_START` });
		try {
			const response = await promiseCreator(...params);
			dispatch({
				type: `${actionType}_COMPLETED`,
				payload: response,
			});
			return response;
		} catch (e) {
			dispatch({
				type: `${actionType}_FAILED`,
				payload: e,
			});
			throw e;
		}
	};
}
