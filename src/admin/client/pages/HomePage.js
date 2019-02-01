import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Icon} from 'antd';

const HomePage = ({userCount, registeredUserCount}) => (
	<>
		<Row>
			<Col span={24}>
				<h2 className="overview--heading">Welcome to AdminDemo</h2>
			</Col>
		</Row>
		<div className="overview-wrap">

			<div className="overview-item overview-item--c3">
				<div className="overview__inner">
					<div className="overview-box clearfix">
						<div className="icon">
							<Icon type="idcard" />
						</div>
						<div className="text">
							<h2>{registeredUserCount}</h2>
							<span>Registered users</span>
						</div>
					</div>
				</div>
			</div>
		
		
			<div className="overview-item overview-item--c2">
				<div className="overview__inner">
					<div className="overview-box clearfix">
						<div className="icon">
							<Icon type="user" />
						</div>
						<div className="text">
							<h2>{userCount}</h2>
							<span>Online users</span>
						</div>
					</div>
				</div>
			</div>	
		</div>
	</>
);





export default connect(
	state => ({ 
		userCount: state.user.userCount,
		registeredUserCount: state.user.counts,
	})
)(HomePage)

