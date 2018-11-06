import { Form, Icon, Input, Button } from 'antd';
import React from 'react';
import _ from 'lodash';

import withSpinner from '../../../hocs/withSpinner';

// Validation
import UserTypes from '../../server/models/user.types';
import { validateField } from '../../../utils/validate';

const FormItem = Form.Item;

class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			forgotActive: false,
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleForgot = this.handleForgot.bind(this);
	}

	// ERROR type 'form' - displayed in fields form
	componentDidUpdate(prevProps) {
		const { error, form } = this.props;

		if (
			!_.isEmpty(error) &&
			error.type === 'form' &&
			prevProps.error.message !== error.message
		) {
			form.setFields({
				[_.get(error, 'formData.fieldName', '')]: {
					value: _.get(error, 'formData.fieldValue', ''),
					errors: [new Error(error.message)],
				},
			});
		}
	}

	handleSubmit(e) {
		const { handleLoginUser, sendResetLinkEmail } = this.props;
		const { forgotActive } = this.state;
		e.preventDefault();
		this.props.form.validateFields(async (err, values) => {
			if (!err) {
				if (forgotActive) {
					sendResetLinkEmail(values);
				} else {
					handleLoginUser(values);
				}
			}
		});
	}

	handleForgot() {
		const { forgotActive } = this.state;
		this.setState({
			forgotActive: !forgotActive,
		});
	}

	render() {
		const { getFieldDecorator } = this.props.form;
		const { forgotActive } = this.state;

		if (forgotActive) {
			return (
				<Form onSubmit={this.handleSubmit} className="center-form">
					<FormItem>
						{getFieldDecorator('email', {
							rules: [
								{
									validator: (rule, value, cb) =>
										validateField(
											UserTypes.SignInForm.email,
											value,
											cb
										),
								},
							],
						})(
							<Input
								prefix={
									<Icon
										type="mail"
										style={{ color: 'rgba(0,0,0,.25)' }}
									/>
								}
								className="basic-input"
								placeholder="email"
							/>
						)}
					</FormItem>
					<FormItem>
						<span
							className="text-click"
							onClick={this.handleForgot}
						>
							Return to login
						</span>
					</FormItem>
					<FormItem>
						<Button
							type="primary"
							className="login-form-button"
							htmlType="submit"
						>
							Submit
						</Button>
					</FormItem>
				</Form>
			);
		}
		return (
			<Form onSubmit={this.handleSubmit} className="center-form">
				<FormItem>
					{getFieldDecorator('email', {
						rules: [
							{
								validator: (rule, value, cb) =>
									validateField(
										UserTypes.SignInForm.email,
										value,
										cb
									),
							},
						],
					})(
						<Input
							prefix={
								<Icon
									type="mail"
									style={{ color: 'rgba(0,0,0,.25)' }}
								/>
							}
							placeholder="email"
							className="basic-input"
						/>
					)}
				</FormItem>
				<FormItem>
					{getFieldDecorator('password', {
						rules: [
							{
								validator: (rule, value, cb) =>
									validateField(
										UserTypes.SignInForm.password,
										value,
										cb
									),
							},
						],
					})(
						<Input
							prefix={
								<Icon
									type="lock"
									style={{ color: 'rgba(0,0,0,.25)' }}
								/>
							}
							type="password"
							placeholder="Password"
							className="basic-input"
						/>
					)}
				</FormItem>
				<FormItem>
					<span className="text-click" onClick={this.handleForgot}>
						Forgot password
					</span>
				</FormItem>
				<FormItem>
					<Button
						type="primary"
						className="login-form-button"
						htmlType="submit"
					>
						Log in
					</Button>
				</FormItem>
			</Form>
		);
	}
}

export default withSpinner(Form.create()(Login));
