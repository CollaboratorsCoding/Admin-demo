import React, { Component } from 'react';

// Components
import Menu from './Menu';
import Sidebar from './Sidebar';

class Navigation extends Component {
    state = {
    	collapsed: false
    }

    openSidebar = () => {
    	this.setState({
		    collapsed: false,
    	})
    }
	
	closeSidebar = () => {
		this.setState({
		    collapsed: true,
		})
	}
	
	breakpointSidebar = broken => {
		this.setState({
			collapsed: broken,
		})
	}

	render() {
    	return (
            <>
				<Sidebar
            	collapsed={this.state.collapsed}
            	isLoggedIn={this.props.isLoggedIn}
            	closeSidebar={this.closeSidebar}
            	breakpointSidebar={this.breakpointSidebar}

				/>
				<Menu
					isLoggedIn={this.props.isLoggedIn}
					user={this.props.user}
					openSidebar={this.openSidebar}
					collapsed={this.state.collapsed}
				/>
            </>
    	)
	}
}



export default Navigation