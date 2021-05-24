import React from "react";
import { Input, NumberRange, ButtonCircle, InputType } from "../../../../components/common";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faPlus } from "@fortawesome/free-solid-svg-icons";
class BillDiscountEdit extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      type: 1,
      listDiscountBill: this.props.promoBillDiscountDetail
    }
  }
  /**
   * add row to table
   */
  addRowBillDiscount = () => {
    const { listDiscountBill } = this.state
    let newRow = {
      total_money: 0,
      type: 1,
      total_value: 0
    }
    let newListDiscount = listDiscountBill.concat(newRow)
    this.setState({ listDiscountBill: newListDiscount })
  }
  /**
   * change data when enter value
   * @param {*} data
   * @param {*} index
   */
  updateListDiscountBill = (data, index) => {
    let { listDiscountBill } = this.state;
    let newList = [...listDiscountBill]
    newList[index] = { ...listDiscountBill[index], ...data }
    this.setState({ listDiscountBill: newList })
    this.props.changeBillDetails(newList)
  }
  /**
   * change unit to change type
   * @param {*} e
   * @param {*} index
   */
  changeUnit = (e, index) => {
    this.setState({ type: Number(e.target.value) })
    this.updateListDiscountBill({ type: Number(e.target.value), total_value: 0 }, index)
  }
  /**
   * delete row
   * @param {*} rowBill
   * @param {*} index
   */
  onDelete = (rowBill, index) => {
    const { listDiscountBill } = this.state
    let newList = [...listDiscountBill]
    newList.splice(index, 1)
    this.setState({
      listDiscountBill: newList
    })
    this.props.changeBillDetails(newList)
  }

  render() {
    const { listDiscountBill, type } = this.state
    const { t } = this.props
    return (
      <div className="content-field-form">
        <div className="head-form e-flex e-m-bottom-10">
          <div style={{ width: "42%" }} className="content-center">{t("promotions.totalMoney")}</div>
          <div style={{ width: "38%" }} >{t("promotions.discount")}</div>
          <div className="e-flex flex content-end e-m-right-5">
            <ButtonCircle type="s5" onClick={this.addRowBillDiscount}>
              <FontAwesomeIcon icon={faPlus} />
            </ButtonCircle>
          </div>
        </div>
        <div className="list-field-form">
          {
            listDiscountBill.length > 0 ?
              listDiscountBill.map((item, index) => {
                return (
                  <div key={index} className="from-item e-flex item-center">
                    <div className="field-form e-flex item-center e-m-right-10">
                      <span>{t("promotions.from")}</span>
                    </div>
                    <div className="field-form flex e-m-right-10 field-total-money">
                      <Input
                        number
                        value={item.total_money}
                        onChange={e => {
                          this.updateListDiscountBill({ total_money: e.target.value }, index)
                        }}
                      />
                    </div>
                    <div className="field-form discount e-m-right-10">
                      {
                        item.type === 1 ?
                          <Input
                            min="0" max="10" step="0.25" value="0.00"
                            value={item.total_value}
                            onChange={e => {
                              this.updateListDiscountBill({ total_value: e.target.value }, index)
                            }}
                          /> :
                          <Input
                            number
                            value={item.total_value}
                            onChange={e => {
                              this.updateListDiscountBill({ total_value: e.target.value }, index)
                            }}
                          />
                      }
                    </div>
                    <div className="field-form e-flex flex">
                      <label className="e-m-right-10 e-flex item-center">
                        <InputType type="radio" name="check-unit"
                          value={2}
                          onChange={e =>
                            this.changeUnit(e, index)
                          } />
                        <span className={item.type === 2 ? "unit e-flex content-center item-center is_active"
                          : " e-flex content-center item-center unit"}>VNĐ</span>
                      </label>
                      <label className="e-flex item-center is_active">
                        <InputType type="radio" name="check-unit"
                          value={1}
                          onChange={e =>
                            this.changeUnit(e, index)
                          }
                        />
                        <span className={item.type === 1 ? "unit e-flex content-center item-center is_active"
                          : "e-flex content-center item-center unit"}>%</span>
                      </label>
                    </div>
                    <div className="e-flex item-center">
                      <ButtonCircle type="s2" onClick={() => this.onDelete(item, index)}>
                        <FontAwesomeIcon icon={faTimes} />
                      </ButtonCircle>
                    </div>
                  </div>
                )
              }) : <div className="e-flex content-center text-nodata">{t("dishManagaments.noData")}</div>
          }
        </div>
      </div>
    )
  }
}
export default BillDiscountEdit;