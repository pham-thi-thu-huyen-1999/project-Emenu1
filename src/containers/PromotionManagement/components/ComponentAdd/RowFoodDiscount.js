import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

import PopupListFood from "../PopupListFood";
import * as apiOrder from "../../../../api/order";

// const listFoodsDb = [
//   {
//     id: 1,
//     name: "Lẩu thẩm cẩm",
//     image:
//       "https://pasgo.vn/Upload/anh-chi-tiet/nha-hang-hoi-an-garden-tran-quoc-toan-1-normal-1285214921125.jpg",
//     isCheck: false,
//   },
//   {
//     id: 2,
//     name: "Cơm chiên hải sản",
//     image:
//       "https://pasgo.vn/Upload/anh-chi-tiet/nha-hang-hoi-an-garden-tran-quoc-toan-1-normal-1285214921125.jpg",
//     isCheck: false,
//   },
//   {
//     id: 3,
//     name: "Gà hấp hành",
//     image:
//       "https://pasgo.vn/Upload/anh-chi-tiet/nha-hang-hoi-an-garden-tran-quoc-toan-1-normal-1285214921125.jpg",
//     isCheck: false,
//   },
//   {
//     id: 4,
//     name: "Dê xối sả",
//     image:
//       "https://pasgo.vn/Upload/anh-chi-tiet/nha-hang-hoi-an-garden-tran-quoc-toan-1-normal-1285214921125.jpg",
//     isCheck: false,
//   },
//   {
//     id: 5,
//     name: "Bò nướng mọi",
//     image:
//       "https://pasgo.vn/Upload/anh-chi-tiet/nha-hang-hoi-an-garden-tran-quoc-toan-1-normal-1285214921125.jpg",
//     isCheck: false,
//   },
//   {
//     id: 6,
//     name: "Lẩu thẩm cẩm",
//     image:
//       "https://pasgo.vn/Upload/anh-chi-tiet/nha-hang-hoi-an-garden-tran-quoc-toan-1-normal-1285214921125.jpg",
//     isCheck: false,
//   },
//   {
//     id: 7,
//     name: "Gà hấp hành",
//     image:
//       "https://pasgo.vn/Upload/anh-chi-tiet/nha-hang-hoi-an-garden-tran-quoc-toan-1-normal-1285214921125.jpg",
//     isCheck: false,
//   },
//   {
//     id: 8,
//     name: "Bò nướng mọi",
//     image:
//       "https://pasgo.vn/Upload/anh-chi-tiet/nha-hang-hoi-an-garden-tran-quoc-toan-1-normal-1285214921125.jpg",
//     isCheck: false,
//   },
//   {
//     id: 9,
//     name: "Lẩu thẩm cẩm",
//     image:
//       "https://pasgo.vn/Upload/anh-chi-tiet/nha-hang-hoi-an-garden-tran-quoc-toan-1-normal-1285214921125.jpg",
//     isCheck: false,
//   },
//   {
//     id: 10,
//     name: "Gà hấp hành",
//     image:
//       "https://pasgo.vn/Upload/anh-chi-tiet/nha-hang-hoi-an-garden-tran-quoc-toan-1-normal-1285214921125.jpg",
//     isCheck: false,
//   },
//   {
//     id: 11,
//     name: "Lẩu thẩm cẩm",
//     image:
//       "https://pasgo.vn/Upload/anh-chi-tiet/nha-hang-hoi-an-garden-tran-quoc-toan-1-normal-1285214921125.jpg",
//     isCheck: false,
//   },
//   {
//     id: 12,
//     name: "Lẩu thẩm cẩm",
//     image:
//       "https://pasgo.vn/Upload/anh-chi-tiet/nha-hang-hoi-an-garden-tran-quoc-toan-1-normal-1285214921125.jpg",
//     isCheck: false,
//   },
//   {
//     id: 13,
//     name: "Lẩu thẩm cẩm",
//     image:
//       "https://pasgo.vn/Upload/anh-chi-tiet/nha-hang-hoi-an-garden-tran-quoc-toan-1-normal-1285214921125.jpg",
//     isCheck: false,
//   },
// ];
class RowFoodDiscount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataListTbl: this.props.dataListTbl,
      listFoodsDb: [],
      showPopupFoods: false,
      isChecked: false,
      activeClass: "",
      idItem: "",
      didUpdate: false,
    };
  }

  componentDidMount = async () => {
    try {
      const res = await apiOrder.getItemList();

      let listFoodsDb = [];
      for (const item of res.data.data) {
        listFoodsDb = listFoodsDb.concat(item.items);
      }
      this.setState({ listFoodsDb });
    } catch (err) {
      console.log(err);
    }
  };

  /**
   *  reset data listFoodsDb from state
   */
  componentDidUpdate() {
    if (this.state.didUpdate) {
      this.state.listFoodsDb.map((item) => {
        if (item.isCheck) {
          item.isCheck = false;
        }
        return item;
      });
      this.setState({ listFoodsDb: this.state.listFoodsDb, didUpdate: false });
    }
  }

  /**
   *
   * update Props for dataListTbl
   */
  UNSAFE_componentWillReceiveProps(newProps) {
    this.setState({ dataListTbl: newProps.dataListTbl });
  }

  /**
   * show popup
   */
  chooseFoodsClick = (id) => {
    const { showPopupFoods } = this.state;
    this.setState({ showPopupFoods: !showPopupFoods, idItem: id });
  };

  /**
   * change type = VND
   */
  changeType = () => {
    this.setState({
      dataListTbl: { ...this.state.dataListTbl, type: 0 },
      activeClass: true,
    });
    this.props.onChangeStatus(0);
  };

  /**
   * change type = %
   */
  changeType2 = () => {
    this.setState({
      dataListTbl: { ...this.state.dataListTbl, type: 1 },
      activeClass: false,
    });
    this.props.onChangeStatus(1);
  };

  /**
   * Change is check checkbox
   */
  handleCheck = () => {
    const { dataListTbl, isChecked } = this.state;
    if (!dataListTbl.isCheck) {
      dataListTbl.isCheck = true;
    } else {
      dataListTbl.isCheck = false;
    }
    this.props.onChange(dataListTbl.isCheck);
    this.setState({ isChecked: !isChecked });
  };

  /**
   *  Get data from props child popupListFood
   *  and update variable didUpdate
   */
  getListDataIsCheck = (id, listDb) => {
    const { dataListTbl } = this.state;
    if (id === dataListTbl.Item_id) {
      dataListTbl.totals = listDb.slice();
    }

    this.setState({ dataListTbl, didUpdate: true });
    this.props.onChangeListFood(dataListTbl.totals);
  };

  /**
   * remove Item food from filed totals
   */
  removeItemFood = (id) => {
    const { dataListTbl } = this.state;
    let totals = dataListTbl.totals.filter((item) => item.item_id !== id);
    dataListTbl.totals = totals.slice();
    this.setState({ dataListTbl, didUpdate: true });
    this.props.onChangeListFood(dataListTbl.totals);
  };

  render() {
    const { listFoodsDb, dataListTbl, showPopupFoods, idItem } = this.state;
    const { onChangeDiscount } = this.props;
    // totals là những foodItem đã dc selected, sau khi submit trả về totals, lặp totals đó để trả ra những total để bỏ vào compoennt
    return (
      <div>
        <ul className="row-tbl">
          <li style={{ width: "40%" }}>
            <div className="item-row">
              {dataListTbl.totals.length > 0
                ? dataListTbl.totals.map((total, index) => (
                    <span key={index} className="item-foods">
                      {total.item_name}{" "}
                      <span
                        style={{
                          color: "#F27922",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                        onClick={() => this.removeItemFood(total.item_id)}
                      >
                        X
                      </span>
                    </span>
                  ))
                : null}
            </div>
          </li>
          <li
            style={{
              width: 60,
              padding: 0,
              paddingBottom: 5,
            }}
          >
            <button
              className="btn-acts-food"
              onClick={() => this.chooseFoodsClick(dataListTbl.item_id)}
            >
              <FontAwesomeIcon icon={faBars} />
            </button>
          </li>
          <li style={{ width: 300 }}>
            <div className="form-group">
              <input
                type="number"
                pattern="^-?[0-9]\d*\.?\d*$"
                value={dataListTbl.discount}
                onChange={(e) => onChangeDiscount(e.target.value)}
              />
            </div>
          </li>
          <li style={{ width: 200 }}>
            <div className="button-option">
              <span
                className={dataListTbl.type === 0 ? "active" : ""}
                onClick={() => this.changeType()}
              >
                {" "}
                VNĐ
              </span>
              <span
                className={dataListTbl.type === 1 ? "active" : ""}
                onClick={() => this.changeType2()}
              >
                %
              </span>
            </div>
          </li>
          <li style={{ width: 70, padding: "0 0 7px" }}>
            <label className="nice-chkbox">
              <input
                type="checkbox"
                id={dataListTbl.item_id}
                onChange={this.handleCheck}
                checked={dataListTbl.isCheck}
              />
              <span className="pl"></span>
            </label>
          </li>
        </ul>
        {showPopupFoods && (
          <PopupListFood
            dataSource={listFoodsDb}
            idItem={idItem}
            listFoodTotals={dataListTbl.totals}
            getListIscheck={this.getListDataIsCheck}
            hide={() => this.setState({ showPopupFoods: !showPopupFoods })}
          />
        )}
      </div>
    );
  }
}

export default RowFoodDiscount;
