import React from 'react';
import { Input, Form, InputNumber, Select } from 'antd';
import UserTypes from '../../server/models/user.types';
import { validateField } from '../../../utils/validate';
// import _ from 'lodash';

const Option = Select.Option;
const FormItem = Form.Item;
export const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
	<EditableContext.Provider value={form}>
		<tr {...props} />
	</EditableContext.Provider>
);

export const EditableFormRow = Form.create()(EditableRow);

export class EditableCell extends React.Component {
	getInput = () => {
	
		if (this.props.dataIndex === 'age') {
			return <InputNumber />;
		}
		if (this.props.dataIndex === 'role') {
			return <Select
				showSearch
				style={{ width: 100 }}
				placeholder="Select a person"
				optionFilterProp="children"
				filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
			>
				<Option value="user">user</Option>
				<Option value="admin">admin</Option>
			</Select>;
		}
		return <Input />;
	};
	
	render() {
		const {
			editing,
			dataIndex,
			title,
			inputType,
			record,
			index,
			...restProps
		} = this.props;
		return (
			<EditableContext.Consumer>
				{(form) => {
					const { getFieldDecorator } = form;
					return (
						<td {...restProps}>
							{editing ? (
								<FormItem style={{ margin: 0 }}>
									{getFieldDecorator(dataIndex, {
										
										rules: [
											{
												validator: (rule, value, cb) =>
													validateField(
														UserTypes.EditForm[dataIndex],
														value,
														cb
													),
											},
										],
										initialValue: record[dataIndex],
									})(this.getInput())}
								</FormItem>
							) : restProps.children}
						</td>
					);
				}}
			</EditableContext.Consumer>
		);
	}
}
