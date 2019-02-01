import React from 'react';
import { Link } from 'react-router-dom';

const PublicMenu = () => (
	<nav className="navbar-unlogged">
		<Link to="/login">Login</Link>
		<Link to="/signup">Register</Link>
	</nav>
);

export default PublicMenu;
