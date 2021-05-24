import React, { Component } from 'react';
import Share from '../Share';
import { PROPERTY } from '../../../../consts/settings/ui/paginate';
import Paginate from '../../Paginate';

class UIPaginate extends Component {
  state = {
    page: 1,
  }
  onChange = ({ selected }) => {
    this.setState({ page: selected })
  }

  render() {
    return (
      <Share propertys={PROPERTY}>
        <button onClick={() => { this.setState({ page: 2 }) }}>ok</button>
        <div className="e-p-10" style={{ background: '#eee' }}>
          <Paginate pageCount={100} initialPage={1} onChange={this.onChange} forcePage={this.state.page} />
        </div>
      </Share>
    );
  }
}

export default UIPaginate;
