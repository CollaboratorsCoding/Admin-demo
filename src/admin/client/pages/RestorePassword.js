import { Form, Icon, Input, Button } from 'antd';
import React from 'react';
import queryString from 'query-string';
import _ from 'lodash';

import withSpinner from '../../../hocs/withSpinner';

// Validation
import UserTypes from '../../server/models/user.types';
import { validateField } from '../../../utils/validate';

const FormItem = Form.Item;

class RestorePassword extends React.Component {
	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
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
		const { changePasswordRestore, location } = this.props;
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				changePasswordRestore(
					queryString.parse(location.search).token,
					values
				);
			}
		});
	}

	render() {
		const { getFieldDecorator } = this.props.form;
		return (
			<Form onSubmit={this.handleSubmit} className="center-form">
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
									type="user"
									style={{ color: 'rgba(0,0,0,.25)' }}
								/>
							}
							type="password"
							placeholder="password"
						/>
					)}
				</FormItem>
				<FormItem>
					<Button
						type="primary"
						className="login-form-button"
						htmlType="submit"
					>
						Save
					</Button>
				</FormItem>
			</Form>
		);
	}
}

export default withSpinner(Form.create()(RestorePassword));
