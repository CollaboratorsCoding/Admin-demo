import React from 'react';
import queryString from 'query-string';
import { Table, Pagination, Icon, Button, Input} from 'antd';
// import _ from 'lodash';
import { EditableContext, EditableCell, EditableFormRow } from '../components/EditableCell';

const Search = Input.Search;
class UserTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currentPage: Number(queryString.parse(this.props.location.search).page),
			editingKey: ''
		}
		this.columns =  [{
			title: 'Name',
			dataIndex: 'name',
			editable: true,
		}, {
			title: 'Age',
			dataIndex: 'age',
			editable: true,
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
		}
	}
	
	onChangePage = async (current) => {
		this.props.history.push({ pathname: '/userstable/', search: `?page=${current}`})
		await this.setState({
			currentPage: current,
		});
		if(!this.props.users[this.state.currentPage]) {
			await this.props.handleGetUsers(current, 10)
		}
	}

	onSaveEdit(form, key){
		form.validateFields((error, row) => {
			if (error) return;
			this.props.handleEditUsers(row, key)
			this.setState({ editingKey: '' });
		});
	}

	isEditing = (record) => record.key === this.state.editingKey;

	cancel = () => {
		this.setState({ editingKey: '' });
	};

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
					inputType: col.dataIndex === 'age' ? 'number' : 'text',
					dataIndex: col.dataIndex,
					title: col.title,
					editing: this.isEditing(record),
				}),
			};
		});
    	return (
    		<div className="table">
				<div className="table-header">
					<div className="table-header-search">
						<p><Icon type="user" />Users: {counts}</p>
						<Search
							style={{maxWidth: 400}}
							placeholder="input search text"
							onSearch={value => console.log(value)}
							enterButton
						/>
					</div>
					
				</div>
				<Table 
					style={{minHeight: 600}}
					bordered
					components={components}
    			pagination={false}
    			loading={{
						indicator: antIcon,
						spinning: this.props.loading
					}}
    			columns={columns} 
    			dataSource={users[this.state.currentPage]} 
    		/>
    			<Pagination 
					onChange={this.onChangePage}
					hideOnSinglePage
					showQuickJumper
					current={this.state.currentPage}
    				className="table-pagination"  
    				total={counts}
    			/>
    		</div>	
    	);
	}
}

export default UserTable;
