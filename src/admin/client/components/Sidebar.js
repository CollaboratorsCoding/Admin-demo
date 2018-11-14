import React from 'react';
import { Link } from 'react-router-dom';
import { Icon, Button } from 'antd';

class Sidebar extends React.Component {
	state = {
		show: true
	}

	s = () => {
		this.setState((prevState) => ({
			show: !prevState.show
		}))
	}

	render() {
		return (
			<>
				<div className="open-sidebar"><Button onClick={this.s} ><Icon type="menu-unfold" /></Button></div>
				<aside style={{display: this.state.show ? 'block' : 'none' }} className="menu-sidebar">
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
								{this.props.isLoggedIn ? (
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
				</aside>
			</>
		)
	}
}

export default Sidebar;
