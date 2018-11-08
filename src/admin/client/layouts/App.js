/* eslint-disable jsx-a11y/no-href */

import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Route, withRouter, Switch, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal, notification } from 'antd';

// Components
import Navigation from '../components/Navigation';
import Sidebar from '../components/Sidebar';

// HOC's
import Authenticated from '../../../hocs/Authenticated';
import Authorized from '../../../hocs/Authorized';
import Public from '../../../hocs/Public';

// Pages
import HomePage from '../pages/HomePage';
import SendMessage from '../pages/SendMessage';
import Login from '../pages/Login';
import Register from '../pages/Register';
import NotFound from '../pages/NotFound';
import Logout from '../pages/Logout';
import UsersTable from '../pages/Users';
import Profile from '../pages/Profile';
import RestorePassword from '../pages/RestorePassword';

// Actions
import UserActions from '../store/user/action';
import MessageActions from '../store/msg/action';

const {
	getUser,
	createUser,
	loginUser,
	logoutUser,
	sendResetLinkEmail,
	changePasswordRestore,
	editUser,
	editUsers,
	uploadAvatar,
	deleteAvatar,
	getUsers,
} = UserActions;

const { sendMessage } = MessageActions

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = { afterLoginPath: null };
		// this.setAfterLoginPath = this.setAfterLoginPath.bind(this);
	}

	componentWillMount() {
		const { checkedAuth, handleGetUser, isLoggedIn, loading } = this.props;
		if (!isLoggedIn && !checkedAuth && !loading) {
			handleGetUser();
		}
	}

	// ERROR && SUCCESS MESSAGES
	componentDidUpdate(prevProps) {
		const { requestSuccess, error, history } = this.props;

		// ERROR with type 'server' HANDLER
		if (
			!_.isEmpty(error) &&
			error.type === 'server' &&
			error.message !== prevProps.error.message
		) {
			notification.error({
				message: 'Error',
				description: error.message,
			});
		}

		// SUCCESS REQUEST HANDLER
		if (
			!_.isEmpty(requestSuccess) &&
			requestSuccess.message !== prevProps.requestSuccess.message
		) {
			notification.success({
				message: 'Success',
				description: requestSuccess.message,
			});
			if (requestSuccess.redirectURL) {
				history.push(requestSuccess.redirectURL);
			}
		}
	}

	// setAfterLoginPath(afterLoginPath) {
	// 	this.setState({ afterLoginPath });
	// }

	render() {
		const { props, state } = this;
		const { checkedAuth, user, isLoggedIn } = this.props;
		if (props.loadingUserState) return null;
		let activationModal = null;

		// MODAL ACTIVATION
		if (checkedAuth && isLoggedIn && !user.isVerified) {
			activationModal = (
				<Modal
					title="Verify your email adress!"
					closable={false}
					footer={null}
					maskClosable={false}
					visible
				>
					<div>
						Email on your <strong>{user.email}</strong> adress was
						sent. Please activate your account.
						{/* <button type="button">Resent Activation Link</button> */}
						<Link style={{float: 'right'}} to="/logout"> Logout</Link>
					</div>
				</Modal>
			);
		}

		return (
			<div className="page-wrapper">
				<Sidebar />
				<div className="page-container">
					<Navigation
						isLoggedIn={props.isLoggedIn}
						user={props.user}
					/>
					{activationModal}
					<div className="main-content">
						<div className="section__content section__content--p30">
							<Switch>
								<Authorized
									allowedRoles={['admin', 'user']}
									path="/"
									exact
									pathAfterFailure="/login/"
									component={HomePage}
									{...props}
									{...state}
								/>
								<Authorized
									allowedRoles={['admin', 'user']}
									path="/profile"
									exact
									pathAfterFailure="/"
									component={Profile}
									{...props}
									{...state}
								/>
								<Authorized
									allowedRoles={['admin', 'user']}
									path="/profile/:id"
									exact
									pathAfterFailure="/"
									component={Profile}
									{...props}
									{...state}
								/>
								<Authenticated
									exact
									path="/logout"
									component={Logout}
									pathAfterFailure="/login"
									{...props}
									{...state}
								/>
								<Authenticated
									exact
									path="/userstable"
									component={UsersTable}
									pathAfterFailure="/login"
									{...props}
									{...state}
								/>
								<Public
									path="/signup/"
									component={Register}
									{...props}
									{...state}
								/>
								<Public
									path="/login/"
									component={Login}
									{...props}
									{...state}
								/>
								<Public
									path="/resetpassword/"
									component={RestorePassword}
									{...props}
									{...state}
								/>
								<Route path="/sendmessage/" render={prop =>
									React.createElement(SendMessage, { ...prop, ...props })
								} />
								<Route component={NotFound} />
							</Switch>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

App.propTypes = {
	loading: PropTypes.bool.isRequired,
	handleGetUser: PropTypes.func.isRequired,
	checkedAuth: PropTypes.bool.isRequired,
	requestSuccess: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
	user: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
	error: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
	history: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
	isLoggedIn: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({ ...state.user });

const mapDispatchToProps = dispatch =>
	bindActionCreators(
		{
			// USER ACTIONS
			handleGetUser: getUser,
			handleGetUsers: getUsers,
			hendleSendMessage: sendMessage,
			handleCreateUser: createUser,
			handleLoginUser: loginUser,
			handleLogOutUser: logoutUser,
			handleEditUser: editUser,
			handleEditUsers: editUsers,
			sendResetLinkEmail,
			changePasswordRestore,
			handleUploadAvatar: uploadAvatar,
			handleDeleteAvatar: deleteAvatar,
		},
		dispatch
	);

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(App)
);
