import React, { Component } from 'react';

class Logout extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidMount() {
		const { handleLogOutUser } = this.props;
		setTimeout(() => {
			handleLogOutUser();
		}, 2000);
	}

	render() {
		return (
			<img
				style={{
					marginLeft: 'auto',
					marginRight: 'auto',
					left: 0,
					right: 0,

					position: 'absolute',
					width: '30%',
				}}
				src="https://i.gifer.com/4V0f.gif"
				alt="roflGif"
			/>
		);
	}
}

export default Logout;
