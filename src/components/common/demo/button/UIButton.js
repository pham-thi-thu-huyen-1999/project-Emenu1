import React, { Component } from 'react';
import Share from '../Share'
import { PROPERTY } from '../../../../consts/settings/ui/button'
import Button from '../../Button'
import ButtonSquare from '../../ButtonSquare'
class UIButton extends Component {

  render() {
    return (
      <Share propertys={PROPERTY}>
        <h5>2.1 Button default</h5>
        <Button >Default </Button>
        <h5>2.2 Button type</h5>
        <Button type='s1' >Button s1 </Button>{' '}
        <Button type='s2' >Button s2 </Button>{' '}
        <Button type='s3' >Button s3 </Button>{' '}
        <Button type='s4' >Button s4 </Button>{' '}
        <Button type='s5' >Button s5 </Button>{' '}
        <h5>2.3 Button main</h5>
        <Button main big  >Button main </Button>{' '}
        <Button main big type='s2'  >Button main s2 </Button>{' '}
        <h5>2.4 Button square</h5>
        <ButtonSquare square type="s2">Button square </ButtonSquare>{' '}
      </Share>
    );
  }
}

export default UIButton;
