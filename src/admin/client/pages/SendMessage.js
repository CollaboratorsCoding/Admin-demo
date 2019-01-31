import React from 'react';

import { Form, Icon, Input, Button, Select, Alert } from 'antd';

const { TextArea } = Input
const FormItem = Form.Item;

const Option = Select.Option;

class Message extends React.Component {
	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				this.props.hendleSendMessage(values);
				this.props.form.resetFields();
			}
		});
	}

	render() {
		const { getFieldDecorator } = this.props.form;
		return (
			
			<div className="msg-form">
			 <Alert
					message="Info"
					description="Demo realtime sending message from not logged in users to admins (for now all logged in users)."
					type="info"
					showIcon
				/>
				<br/>
				<Form onSubmit={this.handleSubmit} className="login-form">
					<FormItem>
						{getFieldDecorator('email', {
							rules: [
								{
									type: 'email', message: 'The input is not valid E-mail!',
								}, {
									required: true, message: 'Please input your E-mail!',
								}
							],
						})(
							<Input prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Email" />
						)}
					</FormItem>
					<FormItem>
						{getFieldDecorator('name', {
							rules: [{ required: true, message: 'Please input your name!' }],
						})(
							<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Name" />
						)}
					</FormItem>

					<FormItem>
						{getFieldDecorator('title', {
							rules: [{ required: true, message: 'Please input your title!' }],
						})(
							<Input prefix={<Icon type='paper-clip' style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Title" />
						)}
					</FormItem>
					<FormItem>
						{getFieldDecorator('tags')(<Select
							mode="multiple"
							showArrow
							placeholder="Enter tags"
						>
							<Option key="proposal">proposal</Option>
							<Option key="question">question</Option>
						</Select>)
						
						}
					</FormItem>

					<FormItem>
						{getFieldDecorator('text', {
							rules: [{ required: true, message: 'Please input your text!' }],
						})(
							<TextArea rows={4} />
						)}
					</FormItem>
					<FormItem>						
						<Button type="primary" htmlType="submit" className="login-form-button">
						Send
						</Button>
					</FormItem>
				</Form>
			</div>
		);
	}
}


export default Form.create()(Message);;
