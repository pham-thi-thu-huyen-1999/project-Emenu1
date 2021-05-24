import React, { Component } from 'react';
import CheckBox from '../../CheckBox'
import Share from '../Share'
import { PROPERTY } from '../../../../consts/settings/ui/checkbox'

class UICheckBox extends Component {
	state = {
		checked: false,
		isCheck: false
	}
	render() {
		const { checked, isCheck } = this.state
		return (
			<Share propertys={PROPERTY}>
				<h5>2.1 Checkbox normal</h5>
				<CheckBox
					name="checkbox"
					label="This is checkbox"
					checked={checked}
					onChange={e => { }}
				/>
				<h5>2.2 Checkbox type</h5>
				<CheckBox
					type="s1"
					name="checkbox2"
					label="This is checkbox s1"
					checked={true}
					onChange={e => { }}
				/>
				<br />
				<CheckBox
					type="s2"
					name="checkbox3"
					label="This is checkbox s2"
					checked={true}
					onChange={e => { }}
				/>
				<br />
				<CheckBox
					type="s3"
					name="checkbox4"
					label="This is checkbox s3"
					checked={true}
					onChange={e => { }}
				/>
				<br />
				<CheckBox
					type="s4"
					name="checkbox5"
					label="This is checkbox s4"
					checked={true}
					onChange={e => { }}
				/>
				<br />
				<CheckBox
					type="s5"
					name="checkbox6"
					label="This is checkbox s5"
					checked={true}
					onChange={e => { }}
				/>
				<br />
				<CheckBox
					type="s6"
					name="checkbox7"
					label="This is checkbox s6"
					checked={true}
					onChange={e => { }}
				/>
				<h5>2.3 Use event change</h5>
				<CheckBox
					name="checkbox8"
					label="This is checkbox"
					checked={checked}
					onChange={checked => this.setState({ checked })}
				/>
				{checked ? <div>true</div> : <div>false</div>}
				<h5>2.4 Change prop</h5>
				<input
					checked={isCheck}
					type="checkbox"
					onChange={
						event => this.setState({ isCheck: event.target.checked })
					} />
				<CheckBox
					name="checkbox9"
					label="This is checkbox"
					checked={isCheck}
					onChange={e => { this.setState({ isCheck: !isCheck }) }}
				/>
			</Share>
		);
	}
}

export default UICheckBox;