import React from 'react';
import { Avatar } from 'antd';

const UserProfile = ({random, user}) => (
	<div className="img-user-profile">
		<div className="profile-bgHome" style={{
			backgroundImage: `url(https://source.unsplash.com/collection/466697/${random})`,
			backgroundPosition: "50% 50%"
		}} />
		<div className="image-wrapper">
			<Avatar style={{border: '1px solid silver'}} className="avatar" size={120} icon="user" src={user.imageURL} />
		</div>
		<div className="user-profile-data">
			<p className="profile-filed name-style">{user.name}</p>
			<p>Age: {user.age}</p>
		</div> 	
	</div>
)

export default UserProfile