import React, { Component } from "react";

import RowFoodDiscount from "./RowFoodDiscount";
class TblFoodDiscount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataListTbl: this.props.dataTbl,
      isCheck: false,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.dataListTbl !== this.state.dataListTbl) {
      this.props.onChange(this.state.dataListTbl);
    }
  }

  addTable = () => {
    const { dataListTbl } = this.state;
    let table = {
      totals: [],
      discount: 0,
      type: 0,
      isCheck: false,
    };

    this.setState({
      dataListTbl: dataListTbl.concat(table),
    });
  };

  onChangeChecked = (data, i) => {
    let { dataListTbl } = this.state;
    dataListTbl[i] = { ...dataListTbl[i], isChecked: data };
    this.setState({ dataListTbl, isCheck: !this.state.isCheck });
  };

  onChangeStatus = (data, i) => {
    let { dataListTbl } = this.state;
    dataListTbl[i] = { ...dataListTbl[i], type: data };
    this.setState({ dataListTbl });
  };

  onChangeDiscount = (data, i) => {
    let { dataListTbl } = this.state;
    dataListTbl[i] = { ...dataListTbl[i], discount: data };
    this.setState({ dataListTbl });
  };

  onChangeListFood = (data, i) => {
    let { dataListTbl } = this.state;
    dataListTbl[i] = {
      ...dataListTbl[i],
      totals: data.map((d) => {
        return { ...d, id: "" };
      }),
    };
    this.setState({ dataListTbl });
  };

  removeItemCheck = () => {
    let { dataListTbl } = this.state;
    dataListTbl = dataListTbl.filter((li) => !li.isCheck);
    this.setState({ dataListTbl });
  };

  render() {
    const { dataListTbl } = this.state;
    return (
      <aside className="tbl-promotion">
        <ul className="head">
          <li style={{ width: "50%" }}>Các món được giảm giá</li>
          <li style={{ width: "50%" }}>Giảm giá</li>
        </ul>
        <div className="slider-container" style={{ maxHeight: 440 }}>
          <div className="tblCustom">
            {dataListTbl.length > 0
              ? dataListTbl.map((item, index) => {
                  return (
                    <RowFoodDiscount
                      key={index}
                      dataListTbl={item}
                      onChange={(data) => this.onChangeChecked(data, index)}
                      onChangeStatus={(data) =>
                        this.onChangeStatus(data, index)
                      }
                      onChangeListFood={(data) =>
                        this.onChangeListFood(data, index)
                      }
                      onChangeDiscount={(data) =>
                        this.onChangeDiscount(data, index)
                      }
                    />
                  );
                })
              : null}
          </div>
        </div>
        <div className="block-action">
          <div
            className="s-btn btn-green"
            style={{ marginRight: 15 }}
            onClick={this.addTable}
          >
            {" "}
            Thêm hàng{" "}
          </div>
          <div className="s-btn btn-green" onClick={this.removeItemCheck}>
            {" "}
            Xóa hàng đã chọn{" "}
          </div>
        </div>
      </aside>
    );
  }
}

export default TblFoodDiscount;
