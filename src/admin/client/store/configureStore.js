import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './rootReducer';
import socketMiddleware from './socketMiddleware';

const isProd = process.env.NODE_ENV === 'production';


const configureStore = (initialState, socketClient) => {
	const middleware = [socketMiddleware(socketClient), thunk];
	let enhancer;
	if (!isProd) {
		const composeEnhancers = typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?   window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
			// Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
		}) : compose;

		enhancer = composeEnhancers(
			applyMiddleware(...middleware),
			// other store enhancers if any
		);
	} else {
		enhancer = compose(
			applyMiddleware(...middleware),
		// other store enhancers if any
		);
	}
	
	const store = createStore(
		rootReducer,
		initialState,
		enhancer
	);

	if (!isProd) {
		if (module.hot) {
			module.hot.accept('./rootReducer', () => {
				store.replaceReducer(rootReducer);
			});
		}
	}

	return store;
};

export default configureStore;