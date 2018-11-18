import React from 'react';
import { Layout, Icon } from 'antd';
import { Link } from 'react-router-dom';

const { Sider } = Layout;

const Sidebar = ({
	isLoggedIn,
	collapsed,
	closeSidebar,
	breakpointSidebar
}) => (
	<Sider
		className="menu-sidebar"
		breakpoint='lg'
		onBreakpoint={broken => {breakpointSidebar(broken)}}
		width={300}
		trigger={null}
		collapsedWidth={0}
			  collapsible
			  collapsed={collapsed}
	>
		<Icon className="btn-close-sidebar" onClick={closeSidebar} type="close" />
			
		
		<div className="logo">
			<span className="brand1">Admin </span>
			<span className="brand2">Demo</span>
		</div>
		
				

		<div className="menu-sidebar__content">
			<nav className="navbar-sidebar">
				<ul className="list-unstyled navbar__list">
					<li>
						<Link to="/">
							<Icon type="home" theme="outlined" />
						Home
						</Link>
					</li>
					<li>
						<Link to="/sendmessage">
							<Icon type="mail" theme="outlined" />
						Send-message
						</Link>
					</li>
					{isLoggedIn ? (
						<li>
							<Link to="/userstable/?page=1">
								<Icon type="user" theme="outlined" />
					Users
							</Link>
						</li>
					) : null}
					
					{/* <li>
					<Link to="/">
						<Icon type="calendar" theme="outlined" />
						Calendar
					</Link>
				</li>
				<li>
					<Link to="/">
						<Icon type="form" theme="outlined" />
						Forms
					</Link>
				</li> */} 
				</ul>
			</nav>
		</div>
	</Sider>
)


export default Sidebar;
