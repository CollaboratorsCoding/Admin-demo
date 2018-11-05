import React from 'react';
// import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { withRouter } from 'react-router';
import _ from 'lodash';
import { Spin, Icon } from 'antd';

class Authorized extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			authorized: false,
		};
	}

	componentWillMount() {
		this.checkIfAuthorized();
	}

	componentDidUpdate() {
		this.checkIfAuthorized();
	}

	checkIfAuthorized() {
		const {
			loading,
			allowedRoles,
			pathAfterFailure,
			checkedAuth,
			history,
			user,
			isLoggedIn
		} = this.props;
		const { authorized } = this.state;

		if (authorized && isLoggedIn) {
			return;
		}
		if (!user) history.push(pathAfterFailure || '/');
		if (!loading && checkedAuth && allowedRoles.length > 0) {
			const hasPermission = _.includes(allowedRoles, user.role);
			if (!hasPermission) {
				this.setState({
					authorized: false,
				});
				history.push(pathAfterFailure || '/');
			} else {
				this.setState({
					authorized: true,
				});
			}
		}
	}

	render() {
		const { component, path, exact, ...rest } = this.props;
		const { authorized } = this.state;
		return authorized ? (
			<Route
				path={path}
				exact={exact}
				render={props =>
					React.createElement(component, { ...rest, ...props })
				}
			/>
		) : (
			<Spin
				indicator={
					<Icon type="loading" style={{ fontSize: 24 }} spin />
				}
			/>
		);
	}
}

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

export default withRouter(Authorized);
