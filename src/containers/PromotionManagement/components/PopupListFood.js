import React, { Component } from "react";
import Button from "../../../components/common/Button";

class PopupListFood extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      listFoods: this.props.dataSource,
      isCheck: false,
      listFoodCheck: this.props.getListIscheck,
      idItem: this.props.idItem,
      listNewFoodIscheck: [],
    };
  }

  /*
   * Click choose item from data foods
   */
  isClickCheckItem = (item_id) => {
    const { listFoods, isCheck, listNewFoodIscheck } = this.state;
    listFoods.map((item) => {
      if (item_id === item.item_id) {
        if (!item.isCheck) {
          item.isCheck = true;
          this.setState({
            listNewFoodIscheck: listNewFoodIscheck.concat(item),
            isCheck: !isCheck,
          });
        } else {
          item.isCheck = false;
          this.setState({
            listNewFoodIscheck: listNewFoodIscheck.filter(
              (li) => li.item_id !== item_id
            ),
            isCheck: !isCheck,
          });
        }
      }
      return item;
    });
  };

  /**
   *  retrun list foods with item have isCheck = true
   */
  componentDidMount() {
    let totalFoods = this.props.listFoodTotals;
    const { listFoods } = this.state;
    if (totalFoods.length > 0) {
      listFoods.map((listFood) => {
        totalFoods.map((totalFood) => {
          if (listFood.item_id === totalFood.item_id) {
            listFood.isCheck = true;
          }
          return totalFood;
        });
        return listFood;
      });
      this.setState({ listFoods });
    }
  }

  /**
   * Click OK button after choose food
   */
  handleClickOk = () => {
    const { listFoods } = this.state;
    let chooseFoods = [];
    listFoods.map((food) => {
      if (food.isCheck) {
        chooseFoods.push(food);
      }
      return food;
    });
    this.props.getListIscheck(this.state.idItem, chooseFoods);
    this.props.hide();
  };

  /**
   * Close popup
   */
  onClosePopup = () => {
    const { listNewFoodIscheck, listFoods } = this.state;
    listFoods.map((item) => {
      listNewFoodIscheck.map((foodCheck) => {
        if (item.item_id === foodCheck.item_id) {
          item.isCheck = false;
        }
        return foodCheck;
      });
      return item;
    });
    this.props.getListIscheck(this.state.idItem, this.props.listFoodTotals);
    this.props.hide();
    this.setState({ listFoods });
  };

  render() {
    const { listFoods } = this.state;
    return (
      <div className="popup" style={{ zIndex: 9999 }}>
        <div
          className="popup-box right-close-btn text-center"
          style={{ maxWidth: 1170, zIndex: 12, top: "9%" }}
        >
          <button
            title="Close (Esc)"
            type="button"
            className="mfp-close"
            onClick={() => this.onClosePopup()}
          >
            ×
          </button>
          <h3 className="main-tit">DANH SÁCH CÁC MÓN ĂN</h3>
          <aside className="msgbox grp-btns">
            <div className="popup-foods flex-box">
              {listFoods.map((item, index) => (
                <div
                  className={item.isCheck ? "item active" : "item"}
                  key={index}
                  onClick={() => this.isClickCheckItem(item.item_id)}
                >
                  <div
                    className="item-img"
                    style={{ backgroundImage: `url(${item.image})` }}
                  ></div>
                  <div className="item-title">
                    <h3>{item.item_name}</h3>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <Button main type="s1" onClick={() => this.onClosePopup()}>
                CANCEL
              </Button>
              <Button main type="s2" onClick={() => this.handleClickOk()}>
                OK
              </Button>
            </div>
          </aside>
        </div>
      </div>
    );
  }
}

export default PopupListFood;
