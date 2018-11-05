import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

class Authenticated extends React.Component {
	componentWillMount() {
	// 	const { setAfterLoginPath, isLoggedIn } = this.props;
	// 	if(!isLoggedIn) {
	// 		setAfterLoginPath(
	// 			`${window.location.pathname}${window.location.search}`
	// 		);
	// 	}
	}

	render() {
		const {
			isLoggedIn,
			component,
			path,
			exact,
			...rest
		} = this.props;
		return (
			<Route
				path={path}
				exact={exact}
				render={props =>
					isLoggedIn ? (
						React.createElement(component, {
							...props,
							...rest,
						})
					) : (
						<Redirect to="/login" />
					)
				}
			/>
		);
	}
}

Authenticated.defaultProps = {
	path: '',
	exact: false,
};

Authenticated.propTypes = {
	isLoggedIn: PropTypes.bool.isRequired,
	component: PropTypes.func.isRequired,
	path: PropTypes.string,
	exact: PropTypes.bool,
};

export default Authenticated;
