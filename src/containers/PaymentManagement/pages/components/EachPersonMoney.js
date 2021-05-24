import React, { Component } from "react";
import Styles from '../PaymentManagement.module.scss';
import _ from "lodash";
import utilsFormat from "../../../../utils/formats";

class EachPersonMoney extends Component {
  constructor(props) {
    super(props)
    this.state = {
      personQuantity: 1,
      totalEachPerson: 0,
      eachPersonMoney: 0
    }
  }

  componentDidUpdate(prevProps) {
    const { totalEachPerson } = this.props;
    const { personQuantity } = this.state;
    if (prevProps.totalEachPerson !== totalEachPerson) {
      this.setState({
        totalEachPerson,
        eachPersonMoney: !_.isNumber(personQuantity) && personQuantity !== 0 ? (totalEachPerson / personQuantity) : totalEachPerson
      })
    }
  }

  componentDidMount() {
    if (this.props.totalEachPerson) {
      this.setState({
        totalEachPerson: this.props.totalEachPerson,
        eachPersonMoney: this.props.totalEachPerson
      })
    }
  }

  onInputPersonQuantity = (event) => {
    let value = this.state.personQuantity;
    if (!_.isNumber(event)) {
      value = event.target.value;
    } else {
      if (value) {
        value = parseInt(value) + event;
      } else {
        value = 0 + event;
      }
    }
    let eachPersonMoney = this.state.totalEachPerson;
    if (value && parseInt(value) > 0) {
      eachPersonMoney = this.state.totalEachPerson / parseInt(value);
    }
    this.setState({
      eachPersonMoney: eachPersonMoney,
      personQuantity: (parseInt(value) >= 0 || value === "") ? value : 0
    })
  }

  render() {
    const { trans, unit_price, partnerSetting } = this.props;
    /* const { trans, partnerSetting } = this.props; */
    return (
      <div className={Styles["money-caculation-block"]}>
        <div className={Styles["money-calculation-wrapper"]}>
          <div className={Styles["title"]}>
            {trans("payment:payment_order.money_calculation.title")}
          </div>
          <div className={Styles["process"]}>
            <div className={Styles["add-person"]}>
              <span className={Styles["add-person-text"]}>{trans("payment:payment_order.money_calculation.quantity")}</span>
              <div className={Styles["process-input"]}>
                <span onClick={this.onInputPersonQuantity.bind(this, -1)} className="icon-subtract" style={{ fontSize: '25px', cursor: 'pointer' }}></span>
                <input onChange={this.onInputPersonQuantity} value={this.state.personQuantity} type="number" />
                <span onClick={this.onInputPersonQuantity.bind(this, 1)} className="icon-plus-person" style={{ fontSize: '25px', cursor: 'pointer' }}>
                  <span className="path1"></span>
                  <span className="path2"></span>
                </span>
              </div>
            </div>
            <div className={Styles["each-person"]}>
              <span className={Styles["each-person-text"]}>{trans("payment:payment_order.money_calculation.each_person_money")}</span>
              <span className={Styles["each-person-price"]}>
                {
                  `${utilsFormat.moneyFormat(Math.ceil(this.state.eachPersonMoney))} ${unit_price}`
                  /* `${utilsFormat.moneyFormat(Math.ceil(this.state.eachPersonMoney))} ` */
                }
                {/* {partnerSetting && JSON.stringify(partnerSetting) != JSON.stringify({}) ? partnerSetting.currency.name_vn : ""} */}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EachPersonMoney;
