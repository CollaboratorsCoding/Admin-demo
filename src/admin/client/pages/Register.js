import { Form, Icon, Input, Button, InputNumber } from 'antd';
import React from 'react';
import _ from 'lodash';

import withSpinner from '../../../hocs/withSpinner';

import UserTypes from '../../server/models/user.types';
import { validateField } from '../../../utils/validate';

const FormItem = Form.Item;

class Register extends React.Component {
	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.state = {
			confirmDirty: false,
		};
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

	compareToFirstPassword = (rule, value, cb) => {
		const form = this.props.form;
		if (value && value !== form.getFieldValue('password')) {
			cb('Two passwords not match!');
		} else {
			validateField(UserTypes.SignUpForm.password, value, cb);
		}
	};

	validateToNextPassword = (rule, value, cb) => {
		const form = this.props.form;
		if (value && this.state.confirmDirty) {
			form.validateFields(['password_confirm'], { force: true });
		}
		validateField(UserTypes.SignUpForm.password, value, cb);
	};

	handleConfirmBlur = e => {
		const value = e.target.value;
		this.setState(prevState => ({
			confirmDirty: prevState.confirmDirty || !!value,
		}));
	};

	handleSubmit(e) {
		const { handleCreateUser } = this.props;
		e.preventDefault();
		this.props.form.validateFields(async (err, values) => {
			if (!err) {
				const formValues = Object.assign({}, values, {password_confirm: undefined});
				await handleCreateUser(formValues);
				window.location.reload(true);
			}
		});
	}

	render() {
		const { getFieldDecorator } = this.props.form;
		return (
			<Form onSubmit={this.handleSubmit} className="center-form">
				<FormItem>
					{getFieldDecorator('email', {
						rules: [
							{
								validator: (rule, value, cb) =>
									validateField(
										UserTypes.SignUpForm.email,
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
							placeholder="Email"
						/>
					)}
				</FormItem>
				<FormItem>
					{getFieldDecorator('name', {
						rules: [
							{
								validator: (rule, value, cb) =>
									validateField(
										UserTypes.SignUpForm.name,
										value,
										cb
									),
							},
						],
					})(
						<Input
							prefix={
								<Icon
									type="solution"
									style={{ color: 'rgba(0,0,0,.25)' }}
								/>
							}
							placeholder="Name"
						/>
					)}
				</FormItem>
				<FormItem>
					{getFieldDecorator('password', {
						rules: [
							{
								validator: this.validateToNextPassword,
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
						/>
					)}
				</FormItem>
				<FormItem>
					{getFieldDecorator('password_confirm', {
						rules: [
							{
								validator: this.compareToFirstPassword,
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
							placeholder="Confirm Password"
							onBlur={this.handleConfirmBlur}
						/>
					)}
				</FormItem>
				<FormItem>
					{getFieldDecorator('age', {
						rules: [
							{
								validator: (rule, value, cb) =>
									validateField(
										UserTypes.SignUpForm.age,
										value,
										cb
									),
							},
						],
					})(<InputNumber min={1} max={90} placeholder="Age" />)}
					<span className="ant-form-text"> y.o</span>
				</FormItem>

				<FormItem>
					<Button
						type="primary"
						className="login-form-button"
						htmlType="submit"
					>
						Register
					</Button>
				</FormItem>
			</Form>
		);
	}
}

export default withSpinner(Form.create()(Register));
