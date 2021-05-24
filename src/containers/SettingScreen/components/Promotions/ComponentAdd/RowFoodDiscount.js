import React, { Component } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import PopupListFood from '../PopupListFood';

const listFoodsDb = [
  {
    id: 1,
    name: "Lẩu thẩm cẩm",
    image: "https://pasgo.vn/Upload/anh-chi-tiet/nha-hang-hoi-an-garden-tran-quoc-toan-1-normal-1285214921125.jpg",
    isCheck: false
  },
  {
    id: 2,
    name: "Cơm chiên hải sản",
    image: "https://pasgo.vn/Upload/anh-chi-tiet/nha-hang-hoi-an-garden-tran-quoc-toan-1-normal-1285214921125.jpg",
    isCheck: false
  },
  {
    id: 3,
    name: "Gà hấp hành",
    image: "https://pasgo.vn/Upload/anh-chi-tiet/nha-hang-hoi-an-garden-tran-quoc-toan-1-normal-1285214921125.jpg",
    isCheck: false
  },
  {
    id: 4,
    name: "Dê xối sả",
    image: "https://pasgo.vn/Upload/anh-chi-tiet/nha-hang-hoi-an-garden-tran-quoc-toan-1-normal-1285214921125.jpg",
    isCheck: false
  },
  {
    id: 5,
    name: "Bò nướng mọi",
    image: "https://pasgo.vn/Upload/anh-chi-tiet/nha-hang-hoi-an-garden-tran-quoc-toan-1-normal-1285214921125.jpg",
    isCheck: false
  },
  {
    id: 6,
    name: "Lẩu thẩm cẩm",
    image: "https://pasgo.vn/Upload/anh-chi-tiet/nha-hang-hoi-an-garden-tran-quoc-toan-1-normal-1285214921125.jpg",
    isCheck: false
  },
  {
    id: 7,
    name: "Gà hấp hành",
    image: "https://pasgo.vn/Upload/anh-chi-tiet/nha-hang-hoi-an-garden-tran-quoc-toan-1-normal-1285214921125.jpg",
    isCheck: false
  },
  {
    id: 8,
    name: "Bò nướng mọi",
    image: "https://pasgo.vn/Upload/anh-chi-tiet/nha-hang-hoi-an-garden-tran-quoc-toan-1-normal-1285214921125.jpg",
    isCheck: false
  },
  {
    id: 9,
    name: "Lẩu thẩm cẩm",
    image: "https://pasgo.vn/Upload/anh-chi-tiet/nha-hang-hoi-an-garden-tran-quoc-toan-1-normal-1285214921125.jpg",
    isCheck: false
  },
  {
    id: 10,
    name: "Gà hấp hành",
    image: "https://pasgo.vn/Upload/anh-chi-tiet/nha-hang-hoi-an-garden-tran-quoc-toan-1-normal-1285214921125.jpg",
    isCheck: false
  },
  {
    id: 11,
    name: "Lẩu thẩm cẩm",
    image: "https://pasgo.vn/Upload/anh-chi-tiet/nha-hang-hoi-an-garden-tran-quoc-toan-1-normal-1285214921125.jpg",
    isCheck: false
  },
  {
    id: 12,
    name: "Lẩu thẩm cẩm",
    image: "https://pasgo.vn/Upload/anh-chi-tiet/nha-hang-hoi-an-garden-tran-quoc-toan-1-normal-1285214921125.jpg",
    isCheck: false
  },
  {
    id: 13,
    name: "Lẩu thẩm cẩm",
    image: "https://pasgo.vn/Upload/anh-chi-tiet/nha-hang-hoi-an-garden-tran-quoc-toan-1-normal-1285214921125.jpg",
    isCheck: false
  },
]
class RowFoodDiscount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataListTbl: this.props.dataListTbl,
      listFoodsDb: listFoodsDb,
      showPopupFoods: false,
      isChecked: false,
      activeClass: '',
      idItem: '',
      didUpdate: false
    }
  }


  /**
     *  reset data listFoodsDb from state
     */
  componentDidUpdate() {
    if (this.state.didUpdate) {
      this.state.listFoodsDb.map((item) => {
        if (item.isCheck) {
          item.isCheck = false
        }
        return item;
      })
      this.setState({ listFoodsDb: this.state.listFoodsDb, didUpdate: false });
    }
  }

  /**
   *
   * update Props for dataListTbl
   */
  componentWillReceiveProps(newProps) {
    this.setState({ dataListTbl: newProps.dataListTbl });
  }

  /**
   * show popup
   */
  chooseFoodsClick = (id) => {
    const { showPopupFoods } = this.state;
    this.setState({ showPopupFoods: !showPopupFoods, idItem: id });
  }

  /**
   * change type = VND
   */
  changeType = () => {
    this.state.dataListTbl.type = 0;
    this.setState({ activeClass: true });
  }

  /**
   * change type = %
   */
  changeType2 = () => {
    this.state.dataListTbl.type = 1;
    this.setState({ activeClass: false });
  }

  /**
   * Change is check checkbox
   */
  handleCheck = () => {
    const { dataListTbl, isChecked } = this.state
    if (!dataListTbl.isCheck) {
      dataListTbl.isCheck = true;
    } else {
      dataListTbl.isCheck = false;
    }
    this.props.onChange(dataListTbl.isCheck)
    this.setState({ isChecked: !isChecked });
  }

  /**
   *  Get data from props child popupListFood
   *  and update variable didUpdate
   */
  getListDataIsCheck = (id, listDb) => {
    const { dataListTbl } = this.state;
    if (id === dataListTbl.id) {
      dataListTbl.totals = (listDb).slice();
    }
    this.setState({ dataListTbl, didUpdate: true });
  }

  /**
   * remove Item food from filed totals
   */
  removeItemFood = (id) => {
    const { dataListTbl } = this.state;
    let totals = dataListTbl.totals.filter(item => item.id !== id)
    dataListTbl.totals = (totals).slice();
    this.setState({ dataListTbl, didUpdate: true });
  }

  render() {
    const { listFoodsDb, dataListTbl, showPopupFoods, idItem } = this.state
    return (
      <div>
        <ul className="row-tbl">
          <li style={{ width: '40%' }}>
            <div className="item-row">
              {
                (dataListTbl.totals.length > 0) ? (
                  dataListTbl.totals.map((total, index) => (
                    <span key={index} className="item-foods" onClick={() => this.removeItemFood(total.id)}>{total.name} <FontAwesomeIcon icon={faTimesCircle} /></span>
                  ))
                ) : null
              }
            </div>
          </li>
          <li style={{
            width: 60,
            padding: 0,
            paddingBottom: 5
          }}>
            <button className="btn-acts-food" onClick={() => this.chooseFoodsClick(dataListTbl.id)}
              ><FontAwesomeIcon icon={faBars} /></button>
          </li>
          <li style={{ width: 300 }}>
            <div className="form-group">
              <input type="number" pattern="^-?[0-9]\d*\.?\d*$" />
            </div>
          </li>
          <li style={{ width: 200 }}>
            <div className="button-option" >
              <span className={(dataListTbl.type === 0) ? 'active' : ''} onClick={() => this.changeType()} > VNĐ</span>
              <span className={(dataListTbl.type === 1) ? 'active' : ''} onClick={() => this.changeType2()} >%</span>
            </div>
          </li>
          <li style={{ width: 70, padding: "0 0 7px" }}>
            <label className="nice-chkbox"><input type="checkbox" id={dataListTbl.id} onChange={this.handleCheck} checked={dataListTbl.isCheck} /><span className="pl"></span></label>
          </li>
        </ul>
        {(showPopupFoods) ? <PopupListFood dataSource={listFoodsDb} idItem={idItem} listFoodTotals={dataListTbl.totals} getListIscheck={this.getListDataIsCheck} hide={() => this.setState({ showPopupFoods: !showPopupFoods })} /> : null}
      </div>
    );
  }
}

export default RowFoodDiscount;