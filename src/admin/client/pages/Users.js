import React from 'react';
import queryString from 'query-string';
import { Table, Pagination, Icon } from 'antd';

const columns = [{
	title: 'Name',
	dataIndex: 'name',
}, {
	title: 'Age',
	dataIndex: 'age',
}, {
	title: 'Email',
	dataIndex: 'email',
}];


class UserTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currentPage: Number(queryString.parse(this.props.location.search).page),
		}
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


	render() {
		const { users, counts }  = this.props;
		const antIcon = <Icon type="sync" style={{ fontSize: 27 }} spin />;
    	return (
    		<div className="table">
				<Table 
					style={{minHeight: 600}}
    			bordered 
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
