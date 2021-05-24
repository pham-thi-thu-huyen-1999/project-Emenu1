import React, { Component } from 'react';
import Share from '../Share'
import SelectBox from '../../SelectBox';
import { PROPERTY } from '../../../../consts/settings/ui/selectBox'

class UISelectbox extends Component {
	state = {
		selected: 1,
		selectProp: null
	}
	render() {
		const options = [
			{
				key: 1,
				text: 'Item 1'
			},
			{
				key: 2,
				text: 'Item 2'
			},
			{
				key: 3,
				text: 'Item 3'
			}
		];
		const optionFree = [
			{
				id: 1,
				name: 'Item 1'
			},
			{
				id: 2,
				name: 'Item 2'
			},
			{
				id: 3,
				name: 'Item 3'
			}
		];

		const { selected, selectProp } = this.state;
		return (
			<Share propertys={PROPERTY}>
				<div style={{ height: 800 }}>
					<h5>2.1 Selectbox normal</h5>
					<SelectBox
						dataSource={options}
						selected={0}
						onChange={e => { }} />
					<h5>2.2 Selectbox with blank</h5>
					<SelectBox
						dataSource={options}
						selected={null}
						blank="vui long chon"
						onChange={e => { }} />
					<h5>2.3 Selectbox with icon right</h5>
					<SelectBox
						dataSource={options}
						selected={1}
						blank="vui long chon"
						onChange={e => { }}>
						<button type="button" className="arrow"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="angle-down" className="svg-inline--fa fa-angle-down fa-w-10 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z"></path></svg></button>
					</SelectBox>
					<h5>2.3 Selectbox with onChange</h5>
					<SelectBox
						dataSource={options}
						selected={selected}
						blank="vui long chon"
						onChange={selected => { this.setState({ selected }) }}>
					</SelectBox>
					{selected}
					<h5>2.3 Selectbox with map</h5>
					<SelectBox
						dataSource={optionFree}
						map={{ key: 'id', text: 'name' }}
						selected={selected}
						blank="vui long chon"
						onChange={selected => { }}>
					</SelectBox>
					<h5>2.3 Selectbox change prop</h5>
					<div style={{ padding: '5px 0' }}>
						<button onClick={() => { this.setState({ selectProp: 1 }) }}>1</button>
						<button onClick={() => { this.setState({ selectProp: 2 }) }}>2</button>
						<button onClick={() => { this.setState({ selectProp: 3 }) }}>3</button>
					</div>
					{selectProp}
					<SelectBox
						dataSource={options}
						selected={selectProp}
						blank="vui long chon"
						onChange={selectProp => { this.setState({ selectProp }) }}>
					</SelectBox>
				</div>
			</Share>
		);
	}
}

export default UISelectbox;