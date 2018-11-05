import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from 'antd';

const Sidebar = () => (
	<aside className="menu-sidebar">
		<Link to="/">
			<div className="logo">
				<span className="brand1">Admin </span>
				<span className="brand2">Demo</span>
			</div>
		</Link>

		<div className="menu-sidebar__content">
			<nav className="navbar-sidebar">
				<ul className="list-unstyled navbar__list">
					<li>
						<Link to="/sendmessage">
							<Icon type="mail" theme="outlined" />
							Send-message
						</Link>
					</li>
					{/* <li>
						<Link to="/">
							<Icon type="table" theme="outlined" />
							Tables
						</Link>
					</li>
					<li>
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
	</aside>
);

export default Sidebar;
