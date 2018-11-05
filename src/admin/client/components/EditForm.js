import { Input, Button, Form } from 'antd';
import React from 'react';
import _ from 'lodash';

import UserTypes from '../../server/models/user.types';
import { validateField } from '../../../utils/validate';

const FormItem = Form.Item;

class EditForm extends React.Component {

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

	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				this.props.onSaveEdit(values)
			}
		});
	}

	render() {
		const { getFieldDecorator } = this.props.form;
		return (
			<Form onSubmit={this.handleSubmit} className="edit-form">
				<FormItem>
					{getFieldDecorator(this.props.inputName, {
						rules: [
							{
								validator: (rule, value, cb) =>
									validateField(
										UserTypes.SignUpForm[this.props.inputName],
										value,
										cb
									),
							},
						],
						initialValue: this.props.inputValue
					})(
						<Input
							type={this.props.inputType}
						/>
					)}
				</FormItem>
				<FormItem>
					<Button htmlType="submit" type='submit' icon="save">Save</Button>
					&nbsp;&nbsp;
					<Button type="danger" onClick={this.props.onCancel}>Cancel</Button>
				</FormItem>
			</Form>
		);
	}
}

const WrappedEditForm = Form.create()(EditForm);

export default WrappedEditForm