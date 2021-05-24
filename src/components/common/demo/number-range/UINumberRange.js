import React, { Component } from 'react';
import Share from '../Share'
import { PROPERTY } from '../../../../consts/settings/ui/numberRange'
import NumberRange from '../../NumberRange'

class UINumberRange extends Component {

  render() {
    return (
      <Share propertys={PROPERTY}>
        <NumberRange max={10} onChange={e => console.log(e)} />
      </Share>
    );
  }
}

export default UINumberRange;
