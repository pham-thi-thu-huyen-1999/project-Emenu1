import React, { Component } from "react";

class TblOrderDiscount extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      dataListTbl: this.props.dataTbl,
      listValInput: [],
      defaultId: this.props.dataTbl[this.props.dataTbl.length - 1]
        ? this.props.dataTbl[this.props.dataTbl.length - 1].id + 1
        : 0,
      activeType: "",
      total: "",
      discount: "",
      typePromo: false,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.dataListTbl !== this.state.dataListTbl) {
      this.props.onChange(this.state.dataListTbl);
    }
  }

  addTable = () => {
    let id = this.state.defaultId + 1;
    this.setState({ defaultId: id });
    let table = {
      id: this.state.defaultId,
      total: 0,
      discount: 0,
      type: 0,
      isCheck: false,
    };

    this.setState({ dataListTbl: this.state.dataListTbl.concat(table) });
  };

  handleCheck = (e) => {
    const id = e.target.id;
    console.log(this.state.dataListTbl);
    this.setState({
      dataListTbl: this.state.dataListTbl.map((li) => {
        if (`${li.id}` === id) {
          return {
            ...li,
            isCheck: true,
          };
        } else {
          return { ...li };
        }
      }),
    });
  };

  removeItemCheck = () => {
    this.setState((prevState) => {
      return {
        dataListTbl: prevState.dataListTbl.filter((li) => !li.isCheck),
      };
    });
  };

  handelChange = (e) => {
    let newItems = [...this.state.dataListTbl];
    newItems[e.target.dataset.id][e.target.className] = parseInt(
      e.target.value
    );
    this.setState({ dataListTbl: newItems });
  };

  changeType = (id) => {
    this.state.dataListTbl.map((item) => {
      if (id === item.id) {
        item.type = 0;
        this.setState({ typePromo: true });
      }
      return id;
    });
  };

  changeType2 = (id) => {
    this.state.dataListTbl.map((item) => {
      if (id === item.id) {
        item.type = 1;
        this.setState({ typePromo: false });
      }
      return id;
    });
  };

  render() {
    return (
      <aside className="tbl-promotion">
        <ul className="head">
          <li style={{ width: 300 }}>Tổng tiền</li>
          <li style={{ width: 300 }}>Giảm giá</li>
        </ul>
        <div className="slider-container" style={{ maxHeight: 440 }}>
          <div className="tblCustom">
            {this.state.dataListTbl.map((item, index) => {
              let totalId = `total-${index}`,
                discountId = `discount-${index}`;
              return (
                <ul key={index} className="row-tbl">
                  <li style={{ width: 300 }}>
                    <div className="form-group">
                      <label className="control-label">Từ</label>
                      <input
                        type="number"
                        pattern="^-?[0-9]\d*\.?\d*$"
                        name={totalId}
                        data-id={index}
                        id={totalId}
                        className="total"
                        defaultValue={item.total}
                        onChange={this.handelChange}
                      />
                    </div>
                  </li>
                  <li style={{ width: 300 }}>
                    <div className="form-group">
                      <input
                        type="number"
                        pattern="^-?[0-9]\d*\.?\d*$"
                        name={discountId}
                        data-id={index}
                        id={discountId}
                        className="discount"
                        defaultValue={item.discount}
                        onChange={this.handelChange}
                      />
                    </div>
                  </li>
                  <li style={{ width: 300 }}>
                    <div className="button-option">
                      <span
                        className={item.type === 0 ? "active" : ""}
                        onClick={() => this.changeType(item.id)}
                      >
                        {" "}
                        VNĐ
                      </span>
                      <span
                        className={item.type === 1 ? "active" : ""}
                        onClick={() => this.changeType2(item.id)}
                      >
                        %
                      </span>
                    </div>
                  </li>
                  <li
                    style={{
                      width: "16%",
                      textAlign: "right",
                      paddingRight: 0,
                      paddingBottom: 7,
                    }}
                  >
                    <label className="nice-chkbox">
                      <input
                        type="checkbox"
                        id={item.id}
                        onChange={this.handleCheck}
                        checked={item.isCheck}
                      />
                      <span className="pl"></span>
                    </label>
                  </li>
                </ul>
              );
            })}
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

export default TblOrderDiscount;
