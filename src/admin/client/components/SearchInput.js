import React from 'react';
import { List, Avatar, Icon } from 'antd';
import _ from 'lodash';
import axios from 'axios';
import { Link } from 'react-router-dom';

class SearchInput extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: '',
			users: [],
		};
		this.startSearch = _.debounce(this.startSearch.bind(this), 300);
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange({ target: { value } }) {
		this.setState({
			value,
		});
		if (value.length > 2) {
			this.startSearch(value);
		} else {
			this.setState({
				users: [],
			});
		}
	}

	startSearch(query) {
		if ([...query].length === 3) {
			return
		}
		axios(`/api/search?q=${query}`)
			.then(({ data }) => {
				this.setState({
					users: data.users,
				});
			})
			.catch(() => {
				this.setState({
					users: [],
				});
			});
	}

	render() {
		const { users, value } = this.state;
		return (
			<div className="search-wrapper">
				<div className="input-wrapper">
					<input
						className="basic-input basic-input--xl"
						placeholder="input search user name"
						value={value}
						onChange={this.handleChange}
					/>
					<button className="au-btn--submit" type="submit">
						<Icon type="search" theme="outlined" />
					</button>
				</div>

				{users.length > 0 && (
					<List
						itemLayout="horizontal"
						dataSource={users}
						renderItem={user => (
							<List.Item>
								<List.Item.Meta
									avatar={
										<Avatar
											className="avatar"
											size={40}
											icon="user"
											src={user.imageURL}
										/>
									}
									title={
										<Link
											onClick={() =>
												this.setState({
													value: '',
													users: [],
												})
											}
											to={`/profile/${user._id}`}
										>
											{user.name}
										</Link>
									}
								/>
							</List.Item>
						)}
					/>
				)}
			</div>
		);
	}
}

export default SearchInput;
