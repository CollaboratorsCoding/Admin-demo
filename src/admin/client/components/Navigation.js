import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

// Components
import Menu from './Menu';
import Sidebar from './Sidebar';

class Navigation extends Component {
    state = {
    	collapsed: window.innerWidth<992
    }
	
    componentDidUpdate(prevProps) {
    	const { location } = this.props;
    	if (prevProps.location.pathname !== location.pathname && this.state.breakpoint) {
    		this.setState({ collapsed: true })
    	}
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
			breakpoint: broken,
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



export default withRouter(Navigation)