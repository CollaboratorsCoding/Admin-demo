import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from './store/configureStore';

import SocketClient from './store/SocketClient';

import './styles/main.scss';

import App from './layouts/App';

const socketClient = new SocketClient();
socketClient.connect();
const initialState = {};
const store = configureStore(initialState, socketClient);

function render(Component) {
	ReactDOM.render(
		<Provider store={store}>
			<BrowserRouter>
				<Component />
			</BrowserRouter>
		</Provider>,
		document.getElementById('react-root')
	);
}
render(App);

if (module.hot) {
	module.hot.accept('./layouts/App.js', () => {
		const NewAppRoot = require('./layouts/App.js').default;
		render(NewAppRoot);
	});
}
