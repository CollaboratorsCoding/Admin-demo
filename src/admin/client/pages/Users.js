import React from 'react';
import queryString from 'query-string';
import axios from 'axios'
import { Table, Pagination, Icon, Button, Input} from 'antd';
import _ from 'lodash';
import { EditableContext, EditableCell, EditableFormRow } from '../components/EditableCell';

const Search = Input.Search;
class UserTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currentPage: Number(queryString.parse(this.props.location.search).page),
			editingKey: '',
			filteredCount: null,
			filteredUsers: {},
		}
		this.startSearch = _.debounce(this.startSearch.bind(this), 500);
		this.columns =  [{
			title: 'Name',
			dataIndex: 'name',
			editable: true,
		}, {
			title: 'Age',
			dataIndex: 'age',
			editable: true,
			width: 60,
		}, {
			title: 'Email',
			dataIndex: 'email',
			editable: false,
		},
		{
			title: 'Role',
			dataIndex: 'role',
			width: 100,
			editable: true,
		},
		{
			title: 'operation',
			width: 210,
			dataIndex: 'operation',
			render: (text, record) => {
				const editable = this.isEditing(record);
				return (
					<div>
						{!editable ? (
							<span style={{
								display: 'flex',
								justifyContent: 'space-between',	
							}}>
								<Button onClick={() => this.edit(record.key)} type="primary" icon="edit" ghost>Edit</Button>
								<Button type="danger" icon="delete" ghost>Delete</Button>
							</span>
						)
							: (
								<EditableContext.Consumer>
									{form => (<span style={{
										display: 'flex',
										justifyContent: 'space-between',
									}}>
										<Button
											type="primary" 
											icon="save" 
											onClick={() => this.onSaveEdit(form, record.key)}
											ghost>Save</Button>
										<Button 
											type="danger"
											onClick={() => this.cancel(record.key)}
											ghost>Cancel</Button>
									</span>)}
								</EditableContext.Consumer>	
								
							)}
					</div>
				)},
		},]
	}

	async componentDidMount() {
		if(!this.state.currentPage) {
			await this.props.history.push({ pathname: '/userstable/', search: `?page=1`})
		}
		if(!this.props.users[this.state.currentPage]) {
			this.props.handleGetUsers(this.state.currentPage, 10)
		}
	}

	 componentDidUpdate() {
		const queryPage = Number(queryString.parse(this.props.location.search).page)
		if(queryPage && this.state.currentPage !== queryPage) {
			 this.setState({
				currentPage: queryPage,
			 });
			 if(!this.props.users[queryPage] && (_.get(this.state, 'filteredUsers[1][0]', '') !== 'Not found')) {
				this.props.handleGetUsers(queryPage, 10)
			}
		}
	}

	onChangePage = async (current) => {
		this.props.history.push({ pathname: '/userstable/', search: `?page=${current}`})
		await this.setState({
			currentPage: current,
		});

		if(!this.props.users[this.state.currentPage] && (_.get(this.state, 'filteredUsers[1][0]', '') !== 'Not found')) {
			await this.props.handleGetUsers(current, 10)
		}
	}

	onSaveEdit = (form, thisKey) => {
		const { currentPage, filteredUsers } = this.state;
		form.validateFields((error, row) => {
			if (error) return;
			this.props.handleEditUsers(row, thisKey)
			if((_.get(this.state, 'filteredUsers[1][0]', '') !== 'Not found')) {
				const newData = filteredUsers[currentPage] ? filteredUsers[currentPage] : [];
				const EditUsersPage = newData.map((user) => {
					if(user.key === thisKey) return {
						key: thisKey,
						email: user.email,
						...row
					}
					return user
				})
				this.setState({ 
					filteredUsers: {
						...filteredUsers, [currentPage]: EditUsersPage
					}, 
				});
			}
			this.setState({editingKey: ''});
		});
	}

	isEditing = (record) => record.key === this.state.editingKey;

	cancel = () => {
		this.setState({ editingKey: '' });
	};

	handleChange = ({ target: { value } }) => {
		if (value.length > 3) {
			this.startSearch(value);
		} else {
			this.setState({
				filteredUsers: {},
				filteredCount: null
			});
			this.props.history.push({ pathname: '/userstable/', search: `?page=${Number(this.props.page)}`})
			
		}
	};

	startSearch(query) {
		axios(`/api/users/search?q=${query}`)
			.then(({ data }) => {
				const pagination = {};
				data.users.forEach((user, index) => {
					let count = 1;
					if((index+1)%10 === 0) {
						count +=1;
					}
					pagination[count] = pagination[count] ? [...pagination[count], user]: [user]
				})
				this.setState({
					filteredUsers: data.users.length
						? pagination
						: {1: ['Not found']},
					filteredCount: data.users.length || 0,
				});

				this.props.history.push({ pathname: '/userstable/', search: `?page=1`})
			})
			.catch(() => {
				this.props.history.push({ pathname: '/userstable/', search: `?page=${this.state.currentPage}`})
				this.setState({
					filteredUsers: {
						1: ['Not found']
					},
					filteredCount: 0
				});
			});
	}

	edit(key) {
		this.setState({ editingKey: key });
	}

	render() {
		const { users, counts }  = this.props;
		const antIcon = <Icon type="sync" style={{ fontSize: 27 }} spin />;
		const components = {
			body: {
				row: EditableFormRow,
				cell: EditableCell,
			},
		};

		const columns = this.columns.map((col) => {
			if (!col.editable) {
				return col;
			}
			return {
				...col,
				onCell: record => ({
					record,
					dataIndex: col.dataIndex,
					title: col.title,
					editing: this.isEditing(record),
				}),
			};
		});
		const filteredFindUsers = _.get(this.state, 'filteredUsers[1].length', '') ? this.state.filteredUsers : users;
		const filteredCounts = _.get(this.state, 'filteredUsers[1].length', '')  ? this.state.filteredCount : counts;
		return (
			<div>
				<div className="tables-header">
					<div className="tables-header-search">
						<p><Icon type="user" />Users: {filteredCounts}</p>
						<Search
							style={{maxWidth: '50%', float: 'right'}}
							placeholder="input search text"
							onInput={this.handleChange}
							enterButton
						/>
					</div>
					
				</div>
				
    		<div className="tables">
					<Table 
						style={{width: '100%'}}
						bordered
						components={components}
    			pagination={false}
    			loading={{
							indicator: antIcon,
							spinning: this.props.loading
						}}
						columns={columns} 
						scroll={{x: 700}}
    			dataSource={(_.get(this.state, 'filteredUsers[1][0]', '') === 'Not found') ? [] : filteredFindUsers[this.state.currentPage]} 
    		/>
    			<Pagination 
						onChange={this.onChangePage}
						hideOnSinglePage
						showQuickJumper
						current={this.state.currentPage}
    				className="table-pagination"  
    				total={filteredCounts}
    			/>
				</div>	
			</div>
    	);
	}
}

export default UserTable;
