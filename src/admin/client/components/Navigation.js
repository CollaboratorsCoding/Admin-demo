import React from 'react';

import PublicNavigation from './PublicNavigation';
import AuthNavigation from './AuthNavigation';
import SearchInput from './SearchInput';

const Navigation = ({
	user,
	isLoggedIn,
	handleGetMessages,
	subscribeMessages,
}) => (
	<header className="header-desktop">
		<div className="section__content section__content--p30">
			<div className="header-wrap">
				{isLoggedIn ? (<SearchInput />) : null}
				<div className="header-button">
					<div className="right-menu">
						{isLoggedIn ? (
							<AuthNavigation
								user={user}
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
