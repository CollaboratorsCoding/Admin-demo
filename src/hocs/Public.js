import React from 'react';
// import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { withRouter } from 'react-router';

const Public = ({ component, isLoggedIn, path, exact, ...rest }) => ( !isLoggedIn ? (
	<Route
		path={path}
		exact={exact}
		render={props =>
			React.createElement(component, { ...rest, ...props })
		}
	/>
) : (
	<Redirect to="/" />
)
)



// Authorized.defaultProps = {
// 	allowedGroup: null,
// 	exact: false,
// 	adminApp: false,
// 	userRoles: [],
// 	userIsInRoles: false,
// 	pathAfterFailure: '/login',
// };

// Authorized.propTypes = {
// 	loading: PropTypes.bool.isRequired,
// 	allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
// 	allowedGroup: PropTypes.string,
// 	component: PropTypes.func.isRequired,
// 	path: PropTypes.string.isRequired,
// 	exact: PropTypes.bool,
// 	adminApp: PropTypes.bool,
// 	history: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
// 	userRoles: PropTypes.arrayOf(PropTypes.string),
// 	userIsInRoles: PropTypes.bool,
// 	pathAfterFailure: PropTypes.string,
// };

export default withRouter(Public);
