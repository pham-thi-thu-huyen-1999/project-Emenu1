import React from "react";
import { Input, Button, NumberRange, ButtonCircle, InputType } from "../../../../components/common";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faPlus } from "@fortawesome/free-solid-svg-icons";
import formats from '../../../../utils/formats';
class VoucherDiscount extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      type: 1,
      listDiscountVoucher: []
    }
  }
  addRowVoucherDiscount = () => {
    const { listDiscountVoucher } = this.state
    let newRow = {
      qty: 0,
      type: 1,
      total_value: 0,
      code: ""
    }
    let newListDiscount = listDiscountVoucher.concat(newRow)
    this.setState({ listDiscountVoucher: newListDiscount })
  }
  changeUnit = (e, index) => {
    this.setState({
      type: Number(e.target.value)
    })
    this.updateListDiscountVoucher({ type: Number(e.target.value), total_value: 0 }, index)
  }
  updateListDiscountVoucher = (data, index) => {
    const { listDiscountVoucher } = this.state
    listDiscountVoucher[index] = { ...listDiscountVoucher[index], ...data }
    this.setState({ listDiscountVoucher })
    this.props.changeVoucherDetails(listDiscountVoucher)
  }

  onDelete = (rowBill, index) => {
    const { listDiscountVoucher } = this.state
    let newList = [...listDiscountVoucher]
    newList.splice(index, 1)
    this.setState({
      listDiscountVoucher: newList
    })
  }

  render() {
    const { listDiscountVoucher } = this.state
    const { t } = this.props
    return (
      <div className="content-field-form">
        <div className="head-form e-flex e-m-bottom-10">
          <div className="head-code">{t("promotions.code")}</div>
          <div className="head-amount e-flex content-center">{t("promotions.amount")}</div>
          <div style={{ width: "30%" }} className="e-flex content-center">{t("promotions.discount")}</div>
          <div className="e-flex flex content-end e-m-right-5">
            <ButtonCircle type="s5" onClick={this.addRowVoucherDiscount}>
              <FontAwesomeIcon icon={faPlus} />
            </ButtonCircle>
          </div>
        </div>
        <div className="list-field-form">
          {
            listDiscountVoucher.length > 0 ?
              listDiscountVoucher.map((item, index) => {
                return (
                  <div key={index} className="from-item e-flex">
                    <div className="field-form field-code e-flex item-center e-m-right-10">
                      <Input
                        value={item.code}
                        onChange={e => {
                          this.updateListDiscountVoucher({ code: e.target.value }, index)
                        }}
                      />
                    </div>
                    <div className="field-form field-amount e-flex content-center e-m-right-10">
                      <Input
                        number
                        value={item.qty}
                        onChange={e => {
                          this.updateListDiscountVoucher({ qty: e.target.value }, index)
                        }}
                      />
                    </div>
                    <div className="field-form field-discount e-flex e-m-right-10 item-center">
                      <div className="input-discount e-flex content-end">
                        {
                          item.type === 1 ?
                            <NumberRange
                              min={0}
                              max={100}
                              defaultValue={item.total_value}
                              onChange={total_value => {
                                this.updateListDiscountVoucher({ total_value }, index)
                              }}
                            /> : <Input
                              number
                              value={item.total_value}
                              onChange={e => {
                                this.updateListDiscountVoucher({ total_value: e.target.value }, index)
                              }}
                            />
                        }
                      </div>
                      <div className="check-label flex e-flex">
                        <label className="e-m-right-10 e-flex item-center">
                          <InputType type="radio" name="check-unit"
                            value={2}
                            onChange={e => {
                              this.changeUnit(e, index)
                            }} />
                          <span className={item.type === 2 ? "unit e-flex content-center item-center is_active"
                            : " e-flex content-center item-center unit"}>VNĐ</span>
                        </label>
                        <label className="e-flex item-center is_active">
                          <InputType type="radio" name="check-unit"
                            value={1}
                            onChange={e => {
                              this.changeUnit(e, index)
                            }} />
                          <span className={item.type === 1 ? "unit e-flex content-center item-center is_active"
                            : "e-flex content-center item-center unit"}>%</span>
                        </label>
                      </div>
                    </div>
                    <div className="e-flex content-end flex">
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
export default VoucherDiscount;