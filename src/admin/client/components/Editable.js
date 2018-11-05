import { Icon } from 'antd';
import React, { Fragment } from 'react';

import EditForm from './EditForm';

class Editable extends React.Component {
	constructor(){
		super()
		this.state = {
			isEditing: false
		};
		this.onClickEdit = this.onClickEdit.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.onSaveEdit = this.onSaveEdit.bind(this);
	}

	onClickEdit(){
		this.setState((prevState) => ({
			isEditing: !prevState.isEditing
		}))
	}

	onSaveEdit(value){
		this.props.handleEditUser(value)
		this.setState({
			isEditing: false
		});
	}

	onCancel() {
		this.setState({
			isEditing: false
		});
	}

	render(){
		const Tag = this.props.tag;
		return(
			<Fragment>
				{this.state.isEditing
					? <EditForm
						inputType={this.props.inputType}
						inputValue={this.props.inputValue}
						inputName={this.props.inputName}
						onSaveEdit={this.onSaveEdit}
						onCancel={this.onCancel}
					/>
					: <Tag>
						<span className={`profile-field ${this.props.fieldStyle}`}>
							{this.props.pre}
							{this.props.inputValue}
							<Icon className="profile-field__edit-btn" type='edit' onClick={this.onClickEdit} theme="outlined" />
						</span>
					</Tag>
				}
			</Fragment>
		)
	}
}
export default Editable