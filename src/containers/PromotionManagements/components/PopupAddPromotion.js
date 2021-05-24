import React from "react";
import {
  Input, RadioList,
  TextArea,
  SelectBox, Button, CropImage
} from "../../../components/common";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import BillDiscount from "./listDiscount/BillDiscount";
import DateApplyPromotion from "./DateApplyPromotion";
import { ComboDiscount } from "./listDiscount/ComboDiscount";
import { FoodDiscount } from "./listDiscount/FoodDiscount"
import VoucherDiscount from "./listDiscount/VoucherDiscount";
import moment from "moment";
import Swal from "../../../utils/sweetalert2";
import Validator from "../../../utils/validator";

export default class AddPromotion extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: 1,
      namePromotion: "",
      selectedStatus: true,
      note: "",
      selectedType: 1,
      totalMoneny: "",
      fieldDiscount: "",
      fromDate: new Date(),
      toDate: new Date(),
      fromHours: moment().format('HH:mm:ss'),
      toHours: moment().format('HH:mm:ss'),
      days: {
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false
      },
      promotionBillDetails: [],
      foodDiscount: {
        foodDetails: [],
        discountItemvalue: 0
      },
      comboDiscount: {
        comboDetails: [],
        discount: 0
      },
      voucherDetails: [],
      errors: {}
    }
    const rules = [
      {
        field: "namePromotion",
        method: "isEmpty",
        validWhen: false,
        message: `${this.props.t("promotions.validNamePromotion")}`
      },
      {
        field: "toDate",
        method: toDate => {
          if (toDate <= this.state.fromDate) {
            return false
          }
          return true
        },
        validWhen: true,
        message: `${this.props.t("promotions.validDate")}`
      }
    ]
    this.validator = new Validator(rules)
  }
  showDiscount = () => {
    const { ...rest } = this.props
    const { selected, errors } = this.state
    if (selected === 1) {
      return (
        <BillDiscount
          changePromotionBillDetails={promotionBillDetails => this.setState({ promotionBillDetails })}
          {...rest}
        />
      )
    } else if (selected === 3) {
      return (
        <ComboDiscount
          changeComboDetails={(data) =>
            this.setState({
              comboDiscount: {
                comboDetails: data
              }
            })
          }
          changeDiscount={discount =>
            this.setState({
              comboDiscount: {
                ...this.state.comboDiscount,
                discount
              }
            })
          }
          errors={this.state.errors}
          {...rest}
        />
      )
    } else if (selected === 2) {
      return (
        <FoodDiscount
          changeListFood={(data) =>
            this.setState({
              foodDiscount: {
                foodDetails: data
              }
            })}
          changeDiscount={(data) => {
            this.setState({
              foodDiscount:
              {
                ...this.state.foodDiscount,
                discountItemvalue: data
              }
            })
          }}
          errors={errors}
          {...rest}
        />
      )
    } else if (selected === 4) {
      return (
        <VoucherDiscount
          changeVoucherDetails={
            voucherDetails =>
              this.setState({
                voucherDetails
              })
          }
          {...rest}
        />
      )
    }
  }
  /**
   * select selected
   * @param {*} selected
   * @param {*} item
   */
  onChangeSelected = (selected, item) => {
    this.setState({
      selected
    })
  }
  /**
   * return data req api
   * @param {*} list
   * @param {*} days
   * @param {*} details
   */
  concatData = (promo, days, details) => {
    let data = {
      promotion: { ...promo, ...days },
      ...details
    }
    return data
  }
  /**
   * popup add success
   */
  showSuccess = () => {
    const { t } = this.props
    Swal.fire({
      icon: 'success',
      title: `${t("promotions.addSuccess")}!`,
      showConfirmButton: true,
    })
  }
  showErr = () => {
    const { t } = this.props
    Swal.fire({
      icon: 'error',
      title: `${t("promotions.error")}!`,
      text: `${t("promotions.reqCheckAgain")}!`
    })
  }

  /**
   * click add promotion
   */
  saveAddPromotion = () => {
    const { t } = this.props
    const { selected, namePromotion, note,
      selectedStatus, fromDate,
      toDate, fromHours, toHours, days,
      promotionBillDetails, selectedType, voucherDetails
    } = this.state
    if (Object.entries(this.validator.validate(this.state)).length === 0 &&
      this.validator.validate(this.state).constructor === Object) {
      Swal.fire({
        title: `${t("promotions.textNoti")}!`,
        text: `${t("promotions.confirmAdd")}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: `${t("promotions.yesAgree")}`,
        cancelButtonText: `${t("promotions.cancel")}`,
      }).then(async (result) => {
        if (result.value) {
          const image = await this.cropImage.uploadImage();
          let dataCommon = {
            name: namePromotion,
            is_active: selectedStatus,
            description: note,
            date_start: moment(fromDate).format(),
            date_end: moment(toDate).format(),
            hour_start: fromHours,
            hour_end: toHours,
            promotion_type_id: selected,
            image
          }
          let data = {}
          let newData = {}
          switch (selected) {
            case 1:
              newData = { ...dataCommon, bill_discount_type: selectedType }
              data = this.concatData(newData, days, { promotion_bill_details: promotionBillDetails })
              this.props.actions.addPromotionDiscountBill({
                data,
                addSuccess: this.showSuccess,
                addError: this.showErr
              });
              this.props.hide();
              break;
            case 2:
              newData = {
                ...dataCommon,
                discount_item_value: this.state.foodDiscount.discountItemvalue,
                discount_item_type: 1
              }
              data = this.concatData(newData, days, { promotion_items: this.state.foodDiscount.foodDetails })
              this.props.actions.addPromotionDiscountItem({
                data,
                addSuccess: this.showSuccess,
                addError: this.showErr
              })
              this.props.hide();
              break;
            case 3:
              newData = { ...dataCommon, discount_item_value: this.state.comboDiscount.discount }
              data = this.concatData(newData, days, { promotion_combo_items: this.state.comboDiscount.comboDetails })
              this.props.actions.addPromotionDiscountComboItem({
                data,
                addSuccess: this.showSuccess,
                addError: this.showErr
              })
              this.props.hide();
              break;
            case 4:
              newData = { ...dataCommon }
              data = this.concatData(newData, days, { promotion_voucher_details: voucherDetails })
              this.props.actions.addPromotionDiscountVoucher({
                data,
                addSuccess: this.showSuccess,
                addError: this.showErr
              });
              this.props.hide();
              break;
          }
        }
      })
    } else {
      this.setState({
        errors: this.validator.validate(this.state)
      })
    }
  }
  onChangeDay = (days) => {
    this.setState({ days });
  }
  render() {
    const { t, listPromotionDiscount, lng } = this.props
    const { ...rest } = this.props
    const { selectedStatus, selectedType, selected,
      fromDate, toDate, fromHours, toHours, days, errors
    } = this.state
    return (
      <div className="add-promotion">
        <div className="content-name e-row">
          <div className="content-name-left e-col-9">
            <div className="name-promotion e-row">
              <span className="e-col-3 e-flex item-center">
                {t("promotions.showName")}
              </span>
              <div className="enter-input e-col-9 flex">
                <Input
                  onChange={event => this.setState({ namePromotion: event.target.value })}
                  placeholder={t("promotions.showName")}
                />
                {errors.namePromotion ?
                  <div className="validation">{errors.namePromotion}</div>
                  : ""
                }
              </div>
            </div>
            <div className="status-prom e-flex e-row">
              <span className="status e-flex item-center e-col-3">{t("promotions.status")}</span>
              <div className="check-status e-col-9 enter-input">
                <RadioList
                  dataSource={[
                    { key: true, text: `${t("promotions.activated")}` },
                    { key: false, text: `${t("promotions.applicableYet")}` }
                  ]}
                  onChange={selected => this.setState({ selectedStatus: selected })}
                  selected={selectedStatus}
                />
              </div>
            </div>
            <div className="note e-flex item-center">
              <TextArea
                onChange={e => this.setState({ note: e.target.value })}
                placeholder={t("promotions.note")}
              />
            </div>
          </div>
          <div className="content-name-right e-col-3 e-flex item-center">
            <CropImage
              ref={element => (this.cropImage = element)}
            />
          </div>
        </div>
        <fieldset className="content-form-promotion">
          <legend className="title-form">{t("promotions.formPromotion")}</legend>
          <div className="form-promotion">
            <div className="list-form-radio e-flex">
              <div className="list-form flex">
                <SelectBox
                  dataSource={listPromotionDiscount}
                  selected={selected}
                  map={{
                    key: "id",
                    text: lng === "en" ? "name_en" : lng === "vi" ? "name_vn" : "name_jp"
                  }}
                  onChange={this.onChangeSelected}
                >
                  <div className="icon-dow">
                    <FontAwesomeIcon icon={faCaretDown} />
                  </div>
                </SelectBox>
              </div>
              <div className="list-radio flex e-flex item-center">
                {
                  selected === 1 ? <RadioList
                    dataSource={[
                      { key: 1, text: `${t("promotions.all")}` },
                      { key: 2, text: `${t("promotions.food")}` },
                      { key: 3, text: `${t("promotions.drink")}` },
                    ]}
                    onChange={selected => this.setState({ selectedType: selected })}
                    selected={selectedType}
                  /> : null
                }
              </div>
            </div>
            {this.showDiscount()}
          </div>
        </fieldset>
        <fieldset className="time-apply-promo">
          <legend className="title-form" >{t("promotions.timeApplication")}</legend>
          <DateApplyPromotion
            fromDate={fromDate}
            changeFromDate={(fromDate) => this.setState({ fromDate })}
            toDate={toDate}
            changeToDate={(toDate) => this.setState({ toDate })}
            fromHours={fromHours}
            changeFromHours={(fromHours) => this.setState({ fromHours })}
            toHours={toHours}
            changeToHours={(toHours) => this.setState({ toHours })}
            days={days}
            onChangeDay={this.onChangeDay}
            changeDays={days => this.setState({ days })}
            errors={this.state.errors}
            {...rest}
          />
        </fieldset>
        <div className="btn-save e-flex content-end">
          <Button type="s5" onClick={this.saveAddPromotion}>{t("promotions.save")}</Button>
        </div>
      </div>
    )
  }
}