import React, { Component } from 'react';
import Share from '../Share'
import { PROPERTY } from '../../../../consts/settings/ui/radio'
import RadioList from './../../RadioList';
const data = [
  { key: 0, text: 'Nữ' },
  { key: 1, text: 'Nam' }
]
class UIRadio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null
    }
  }
  render() {
    const { selected } = this.state
    return (
      <Share propertys={PROPERTY}>
        <RadioList
          name="gioitinh"
          dataSource={data}
          onChange={selected => this.setState({ selected })}
          selected={selected}
        />
      </Share>
    );
  }
}

export default UIRadio;