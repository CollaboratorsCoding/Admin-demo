import React from 'react';
import { Row, Col , Icon} from 'antd';

const HomePage = ({userCount, counts}) => (
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
							<h2>{counts}</h2>
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

export default HomePage;
