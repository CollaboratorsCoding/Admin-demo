import React from 'react';

import { Upload, Icon, message } from 'antd';


function beforeUpload(file) {
	const isJPG = file.type === 'image/jpeg';
	if (!isJPG) {
		message.error('You can only upload JPG file!');
	}
	const isLt2M = file.size / 1024 / 1024 < 2;
	if (!isLt2M) {
		message.error('Image must smaller than 2MB!');
	}
	return isJPG && isLt2M;
}

export default class UploadImage extends React.Component {
	customRequest = ({ file }) => {
		const data = new FormData();

		data.append('avatar', file, 'avatar');
		// eslint-disable-next-line
		this.props.handleUploadAvatar(data);
	};

	render() {
		return (
			<Upload
				name="avatar"
				listType="picture-card"
				className="avatar avatar-upload"
				showUploadList={false}
				customRequest={this.customRequest}
				beforeUpload={beforeUpload}
		
			>
				{<div><Icon
					style={{fontSize: 50}}
					type="camera"
					 /></div>}
			</Upload>
		);
	}
}
