import React, { Component } from 'react';
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faBars, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import RowFoodDiscount from './RowFoodDiscount';
class TblFoodDiscount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataListTbl: [],
      defaultId: 1,
      isCheck: false,
    }
  }

  addTable = () => {
    const { defaultId, dataListTbl } = this.state;
    let idItem = defaultId + 1;
    let table = {
      id: defaultId,
      totals: [],
      discount: '',
      type: 0,
      isCheck: false,
    }
    this.setState({ defaultId: idItem, dataListTbl: dataListTbl.concat(table) });

  }

  onChangeChecked = (data) => {
    this.state.dataListTbl.isCheck = data;
    this.setState({ isCheck: !this.state.isCheck })
  }

  removeItemCheck = () => {
    this.setState(prevState => {
      return {
        dataListTbl: prevState.dataListTbl.filter(li => !li.isCheck)
      };
    });
  }

  render() {
    const { dataListTbl } = this.state
    return (
      <aside className="tbl-promotion">
        <ul className="head">
          <li style={{ width: '50%' }}>Các món được giảm giá</li>
          <li style={{ width: '50%' }}>Giảm giá</li>
        </ul>
        <div className="slider-container" style={{ maxHeight: 440 }}>
          <div style={{ height: 120, overflow: "auto" }} className="tblCustom" >
            {
              (dataListTbl.length > 0) ? (
                dataListTbl.map((item, index) => {
                  return (<RowFoodDiscount key={index} dataListTbl={item} onChange={data => this.onChangeChecked(data)} />)
                })
              ) : null
            }
          </div>
        </div>
        <div className="block-action">
          <div className="s-btn btn-green" style={{ marginRight: 15 }} onClick={this.addTable}> Thêm hàng </div>
          <div className="s-btn btn-green" onClick={this.removeItemCheck}> Xóa hàng đã chọn </div>
        </div>
      </aside >
    );
  }
}

export default TblFoodDiscount;