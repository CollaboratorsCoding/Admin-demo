import React, { Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import _ from 'lodash';

import { Icon, Avatar, Dropdown, Tag, Badge } from 'antd';
import MessageActions from '../store/msg/action';

import AllMsg from './AllMsg';

const {
	getMessages,
	subscribeMessages,
	handleReadChange
} = MessageActions;


class AuthNavigation extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			visibleModal: false,
		};
		this.showModal = this.showModal.bind(this);
		this.handleCancelModal = this.handleCancelModal.bind(this);
		
	}

	componentDidMount = () => {
		this.props.handleGetMessages(3);
		this.props.subscribeMessages();
		this.props.getCount();
	};

	showModal = async (id, isRead) => {
		if (_.isBoolean(isRead) && !isRead) {
			await this.props.handleReadChange({ messagesId: id });
		}

		if (this.props.messages.length <= 3) {
			await this.props.handleGetMessages(20);
		}

		this.setState({
			active: id,
			visibleModal: true,
		});
	};

	handleCancelModal = () => {
		this.setState({ visibleModal: false });
	};

	changeStatusToRead = messagesId => {
		if (messagesId.length) {
			this.props.handleReadChange({ messagesId });
		}
	};

	renderMessages = messages => {
		if (!messages) return <div>No messages for now</div>;
		return messages.slice(0, 3).map(message => (
			<div
				className={`email__item ${!message.isRead &&
					'email__item--unread'}`}
				key={message._id}
			>
				<div
					onClick={() => this.showModal(message._id, message.isRead)}
					className="content"
				>
					<p>{message.title}</p>
					<span>
						{moment(message.date).format(
							'ddd DD.MM.YYYY   H:mm:SS'
						)}{' '}
						{!message.isRead && (
							<Tag style={{ float: 'right' }} color="red">
								New
							</Tag>
						)}
					</span>
				</div>
			</div>
		));
	};

	render() {
		const { user, messages, unreadCount, userCount } = this.props;
		const colors = {
			admin: '#f50',
			user: '#2db7f5',
		};
		const dropdownMessages = (
			<div className="email-dropdown">
				{this.renderMessages(messages)}
				<div className="email__footer">
					<span onClick={() => this.showModal()}>See all emails</span>
				</div>
			</div>
		);
		const dropdownProfile = (
			<div className="account-dropdown">
				<div className="info clearfix">
					<div className="image">
						<a href="google.com">
							<Avatar
								shape="square"
								src={user.imageURL}
								size={64}
								icon="user"
							/>
						</a>
					</div>
					<div className="content">
						<h5 className="name">
							{user.name}
							<span className="navbar-role">
								<Tag color={colors[user.role]}>{user.role}</Tag>
							</span>
						</h5>
						<span className="email">{user.email}</span>
					</div>
				</div>
				<div className="account-dropdown__body">
					<div className="account-dropdown__item">
						<Link to="/profile">
							<Icon type="profile" theme="outlined" />
							Profile
						</Link>
					</div>
					<div className="account-dropdown__item">
						<Link to="/profile">
							<Icon type="setting" theme="outlined" />
							Settings
						</Link>
					</div>
				</div>
				<div className="account-dropdown__footer">
					<Link to="/logout">
						<Icon type="logout" theme="outlined" />
						Logout
					</Link>
				</div>
			</div>
		);

		return (
			<Fragment>
				<AllMsg
					active={this.state.active}
					{...this.props}
					handleCancelModal={this.handleCancelModal}
					visible={this.state.visibleModal}
				/>
				<div className="noti-wrap">
					<Dropdown overlay={dropdownMessages} trigger={['click']}>
						<div className="noti__item">
							<Badge count={unreadCount}>
								<Icon
									type="mail"
									style={{ fontSize: '28px' }}
									theme="outlined"
								/>
							</Badge>
						</div>
					</Dropdown>
					<div className="noti__item">
						<Badge count={userCount}>
							<Icon
								type="team"
								style={{ fontSize: '28px' }}
								theme="outlined"
							/>
						</Badge>
					</div>
				</div>
				<div className="account-wrap">
					<Dropdown overlay={dropdownProfile} trigger={['click']}>
						<div className="account-item clearfix">
							<div className="image">
								<Avatar
									shape="square"
									src={user.imageURL}
									size="large"
								/>
							</div>
							<div className="content">
								<div className="ant-dropdown-link">
									{user.name} <Icon type="down" />
								</div>
							</div>
						</div>
					</Dropdown>
				</div>
			</Fragment>
		);
	}
}

const mapStateToProps = state => ({ ...state.msg });

const mapDispatchToProps = dispatch =>
	bindActionCreators(
		{
			// MESSAGE ACTIONS
			handleGetMessages: getMessages,
			subscribeMessages,
			handleReadChange,
		},
		dispatch
	);

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(AuthNavigation)
);
