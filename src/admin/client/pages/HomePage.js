import React from 'react';
import { Row, Col } from 'antd';

const HomePage = () => (
	<div>
		<Row>
			<Col span={24}>
				<h2 className="overview--heading">Applications to choose</h2>
			</Col>
		</Row>
		<Row gutter={48}>
			<Col span={8}>
				<div className="overview-item overview-item--c1">
					<div className="overview__inner">
						<div className="overview-box clearfix">
							<div className="icon">
								<i className="zmdi zmdi-account-o" />
							</div>
							<div className="text">
								<h2>Estimate</h2>
								<span>estiamting app for developers</span>
							</div>
						</div>
					</div>
				</div>
			</Col>
			<Col span={8}>
				<div className="overview-item overview-item--c2">
					<div className="overview__inner">
						<div className="overview-box clearfix">
							<div className="icon">
								<i className="zmdi zmdi-account-o" />
							</div>
							<div className="text">
								<h2>ChatBot</h2>
								<span>
									Chat on sockets with fb, slack bot
									integration
								</span>
							</div>
						</div>
					</div>
				</div>
			</Col>
			<Col span={8}>
				<div className="overview-item overview-item--c3">
					<div className="overview__inner">
						<div className="overview-box clearfix">
							<div className="icon">
								<i className="zmdi zmdi-account-o" />
							</div>
							<div className="text">
								<h2>App 3</h2>
								<span>Soon...</span>
							</div>
						</div>
					</div>
				</div>
			</Col>
		</Row>
	</div>
);

export default HomePage;
