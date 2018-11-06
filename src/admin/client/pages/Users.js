import React from 'react';
import { Table, Pagination } from 'antd';

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
    state = {

    };

    componentDidMount() {
    	this.props.handleGetUsers()
    }


    render() {
    	const { users, counts }  = this.props.users;
    	return (
    		<div className="table">
    			<Table 
    			bordered 
    			pagination={false}
    			columns={columns} 
    			dataSource={users} 
    		/>
    			<Pagination 
    				className="table-pagination"  
    				total={counts} 
    			/>
    		</div>	
    	);
    }
}

export default UserTable;
