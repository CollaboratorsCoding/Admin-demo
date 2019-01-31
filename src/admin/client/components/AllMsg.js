import React from 'react';
import { Modal, Collapse, Tag, Icon, Badge } from 'antd';
import axios from 'axios';

import _ from 'lodash';
import moment from 'moment';
import Pagination from './Pagination';

const Panel = Collapse.Panel;

const colors = {
	not_tagged: '#f50',
	question: 'green',
	proposal: 'yellow',
};

// const customPanelStyle = {
// 	background: '#f7f7f7',
// 	marginBottom: 13,
// 	overflow: 'hidden',
// };

class AllMsg extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currentPage: 1,
			filteredMessages: [],
			searchValue: '',
		};
		this.startSearch = _.debounce(this.startSearch.bind(this), 300);
	}

	componentDidUpdate(prevProps) {
		if (
			_.get(this.state, 'active.length', false) &&
			prevProps.active === this.props.active
		) {
			return;
		}
		if (this.props.active && prevProps.active !== this.props.active) {
			this.setState(prevState => {
				const state = prevState.active || [];
				return { active: [...state, this.props.active] };
			});
		}
	}

	onPageChange = async p => {
		await this.setState(prevState => ({
			currentPage: prevState.currentPage + 1 * p,
		}));
		const offset = (this.state.currentPage - 1) * 20;
		if (
			!this.state.filteredMessages.length &&
			this.state.filteredMessages[0] !== 'not_found' && this.props.messages.length <= offset
		) {
			this.props.handleGetMessages(20, offset);
			
		}
	};

	callback = key => {
		// console.log(key)
		this.setState(() => ({ active: [...key] }));
	};

	handleChange = ({ target: { value } }) => {
		this.setState({
			searchValue: value,
		});
		if (value.length >= 2) {
			this.startSearch(value);
		} else {
			this.setState({
				filteredMessages: [],
			});
		}
	};

	// SEARCH HANDLER
	startSearch(query) {
		if (query.length === 2) {
			return
		}
		axios(`/api/messages/search?q=${query}`)
			.then(({ data }) => {
				this.setState({
					filteredMessages: data.messages.length
						? data.messages
						: ['not_found'],
					currentPage: 1,
				});
			})
			.catch(() => {
				this.setState({
					filteredMessages: [],
				});
			});
	}

	renderAllMessages = (messages, page) => {
		if (this.props.loading)
			return <Icon className="message-loader" type="sync" spin />;
		if (!messages) return <div>No messages for now</div>;
		const messagesRender = messages
			.slice(20 * (page - 1), 20 * page)
			.map(message => (
				<Panel
					showArrow={false}
					header={
						<div
							className="message-header"
							onClick={() => {
								if (!message.isRead)
									this.props.handleReadChange({
										messagesId: message._id,
									});
								if (this.state.filteredMessages.length) {
									const filteredArray = [
										...this.state.filteredMessages,
									];
									const messageIndex = _.findIndex(
										filteredArray,
										msg => msg._id === message._id
									);
									const newArray = filteredArray.map(
										(msg, index) => {
											if (index === messageIndex) {
												return {
													...filteredArray[
														messageIndex
													],
													isRead: true,
												};
											}
											return msg;
										}
									);
									this.setState({
										filteredMessages: newArray,
									});
								}
							}}
						>
							{!message.isRead && (
								<Badge
									style={{
										position: 'absolute',
										left: 20,
									}}
									status="error"
								/>
							)}
							<span>{message.title}</span>
							<span
								style={{
									float: 'right',
									marginRight: 15,
									color: 'rgb(121, 114, 114)',
								}}
							>
								{moment(message.date).format('DD.MM | H:mm')}{' '}
							</span>
							<div className="message-tags">
								{message.tags.map(tag => (
									<Tag
										key={tag}
										style={{ float: 'right' }}
										color={colors[tag]}
									>
										{tag}
									</Tag>
								))}
							</div>
						</div>
					}
					key={message._id}
				>
					<div className="sender-info">
						<div className="from-info">
							<span>From:</span>{' '}
							<Icon type="mail" theme="twoTone" />
							{message.email}({message.name})
						</div>
						<div className="from-date">
							<div className="time">
								{moment(message.date).format('H:mm')}{' '}
							</div>
							<div className="day">
								{moment(message.date).format('ddd DD.MM.YYYY')}{' '}
							</div>
						</div>
					</div>
					<div className="sender-text">{message.text}</div>
				</Panel>
			));
		const activeKeys = this.props.active
			? { activeKey: this.state.active }
			: null;
		return (
			<Collapse onChange={this.callback} bordered={false} {...activeKeys}>
				{messagesRender}
			</Collapse>
		);
	};

	render() {
		const { filteredMessages, searchValue } = this.state;
		const totalCount = filteredMessages.length
			? filteredMessages.length
			: this.props.unreadCount + this.props.readCount;

		return (
			<div>
				<Modal
					width="70%"
					visible={this.props.visible}
					title={
						<div className="input-wrapper">
							<input
								className="basic-input basic-input--xl"
								placeholder="input search text"
								value={searchValue}
								onChange={this.handleChange}
							/>
							<button className="au-btn--submit" type="submit">
								<Icon type="search" theme="outlined" />
							</button>
						</div>
					}
					destroyOnClose={false}
					maskClosable={false}
					onCancel={this.props.handleCancelModal}
					footer={
						<Pagination
							setPage={this.onPageChange}
							pageSize={20}
							totalItems={totalCount}
							currentPage={this.state.currentPage}
						/>
					}
				>
					<div className="modal-body">
						{filteredMessages[0] === 'not_found'
							? 'Not found'
							: this.renderAllMessages(
								filteredMessages.length
									? filteredMessages
									: this.props.messages,
								this.state.currentPage
							)}
					</div>
				</Modal>
			</div>
		);
	}
}

export default AllMsg;
