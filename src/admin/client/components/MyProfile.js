import React, {Fragment} from 'react';
import { Avatar, Icon, Modal } from 'antd';
import UploadImage from './UploadImage';
import Editable from './Editable';
import withSpinner from '../../../hocs/withSpinner';

const confirm = Modal.confirm;

function showConfirm(handleDeleteAvatar) {
	confirm({
		title: 'Do you want to delete photo?',
		onOk() {
			handleDeleteAvatar();
		}
	});
}

const MyProfile = ({ random, user, handleEditUser, handleUploadAvatar, handleDeleteAvatar }) => (
	<div className="img-user-profile">
		<div
			className="profile-bgHome"
			style={{
				backgroundImage: `url(https://source.unsplash.com/collection/466697/${random})`,
				backgroundPosition: '50% 50%',
				backgroundRepeat: 'no-repeat',
			}}
		/>
		<div className="image-wrapper">
			{user.imageURL ? (
				<Fragment>
					<Icon onClick={() => showConfirm(handleDeleteAvatar)} className="delete-btn" type="close-circle" theme="filled" />
					<Avatar
						style={{ border: '1px solid silver' }}
						className="avatar"
						size={120}
						src={user.imageURL}
						icon="user"
					/>
				</Fragment>
			) : (
				<UploadImage handleUploadAvatar={handleUploadAvatar} />
			)}
		</div>

		<div className="user-profile-data">
			<Editable
				tag="p"
				inputName="name"
				inputType="text"
				fieldStyle="name-style"
				handleEditUser={handleEditUser}
				inputValue={user.name}
			/>
			<Editable
				tag="p"
				pre="Age: "
				inputName="age"
				inputType="number"
				handleEditUser={handleEditUser}
				inputValue={user.age}
			/>
			<p>Email: {user.email}</p>
		</div>
	</div>
);

export default withSpinner(MyProfile);
