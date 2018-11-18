import React from 'react';
import { Icon } from 'antd';
import PublicNavigation from './PublicNavigation';
import AuthNavigation from './AuthNavigation';
import SearchInput from './SearchInput';

const Navigation = ({
	user,
	isLoggedIn,
	handleGetMessages,
	subscribeMessages,
	collapsed,
	userCount,
	openSidebar
}) => (
	<header className="header-desktop">
		<div className="section__content section__content--p30">
			<div className="header-wrap">
				<Icon
					className="trigger"
					type={collapsed ? 'menu-unfold' : 'menu-fold'}
					onClick={openSidebar}
				/>
				{isLoggedIn ? (<SearchInput />) : null}
				<div className="header-button">
				
					<div className="right-menu">
						{isLoggedIn ? (
							<AuthNavigation
								user={user}
								userCount={userCount}
								handleGetMessages={handleGetMessages}
								subscribeMessages={subscribeMessages}
							/>
						) : (
							<PublicNavigation />
						)}
					</div>
				</div>
			</div>
		</div>
	</header>
);

export default Navigation;
