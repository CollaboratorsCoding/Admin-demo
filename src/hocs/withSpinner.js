import React from 'react'
import { Spin, Icon } from 'antd';

const antIcon = <Icon type="sync" style={{ fontSize: 27 }} spin />;

const withSpinner = (WrappedComponent) => (props) => (
	<Spin indicator={antIcon} tip="Loading" spinning={props.loading}>
		<WrappedComponent {...props}/>
	</Spin>
)

export default withSpinner;
