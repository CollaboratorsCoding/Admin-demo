import React from 'react';
import { Icon } from 'antd';
import PublicMenu from './PublicMenu';
import AuthMenu from './AuthMenu';
import SearchInput from './SearchInput';

const Menu = ({
	user,
	isLoggedIn,
	handleGetMessages,
	subscribeMessages,
	userCount,
	getCount,
	openSidebar
}) => (
	<header className="header-desktop">
		<div className="section__content section__content--p30">
			<div className="header-wrap">
				<Icon
					className="trigger"
					type='menu-unfold'
					onClick={openSidebar}
				/>
				{isLoggedIn ? (<SearchInput />) : null}
				<div className="header-button">
				
					<div className="right-menu">
						{isLoggedIn ? (
							<AuthMenu
								user={user}
								getCount={getCount}
								userCount={userCount}
								handleGetMessages={handleGetMessages}
								subscribeMessages={subscribeMessages}
							/>
						) : (
							<PublicMenu />
						)}
					</div>
				</div>
			</div>
		</div>
	</header>
);

export default Menu;
