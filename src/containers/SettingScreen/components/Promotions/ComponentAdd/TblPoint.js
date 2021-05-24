import React, { Component } from 'react';
class TblPoint extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataListTbl:this.props.dataTbl,
      defaultId:0
    }
  }
  addTable = () => {
    let id = this.state.defaultId + 1
    this.setState({ defaultId: id })
    let table = {
        id: this.state.defaultId,
        total: '',
        discount: '',
        type: '',
        ischeck: false
    }
    this.setState({ dataListTbl: this.state.dataListTbl.concat(table) })
}

handleCheck = (e) => {
    const id = e.target.id;
    this.setState(prevState => {
        return {
            dataListTbl: prevState.dataListTbl.map(
                li => (li.id === +id ? {
                    ...li,
                    ischeck: !li.ischeck
                } : li)
            )
        };
    });
}

removeItemCheck = () => {
    this.setState(prevState => {
        return {
            dataListTbl: prevState.dataListTbl.filter(li => !li.ischeck)
        };
    });
}
  render() {
    return (
      <aside className="tbl-promotion">
        <ul className="head">
          <li style={{ width: '30%' }}>Tổng tiền</li>
          <li style={{ width: '30%' }}>Điểm cộng</li>
        </ul>
        <div className="slider-container" style={{ maxHeight: 440 }}>
          <div style={{ height: 120, overflow: "auto" }} className="tblCustom" >
            {
              this.state.dataListTbl.map((item, index) => (
                <ul key={index} className="row-tbl">
                  <li style={{ width: 300 }}>
                    <div className="form-group">
                      <label className="control-label">Từ</label>
                      <input className="form-control"
                      type="number"
                      pattern="^-?[0-9]\d*\.?\d*$"
                      />
                    </div>
                  </li>
                  <li style={{ width: 300 }}>
                    <div className="form-group">
                      <input className="form-control"
                      type="number"
                      pattern="^-?[0-9]\d*\.?\d*$"
                      />
                    </div>
                  </li>
                  <li style={{ width: '43%', textAlign: 'right', paddingRight: 0, paddingBottom: 7 }}>
                  <label className="nice-chkbox"><input type="checkbox" id={item.id} onChange={this.handleCheck} checked={item.ischeck} /><span className="pl"></span></label>
                  </li>
                </ul>
              ))
            }
          </div>

        </div>
        <div className="block-action">
          <div className="s-btn btn-green" style={{ marginRight: 15 }} onClick={this.addTable}> Thêm hàng </div>
          <div className="s-btn btn-green" onClick={this.removeItemCheck}> Xóa hàng đã chọn </div>
        </div>

      </aside>
    );
  }
}

export default TblPoint;