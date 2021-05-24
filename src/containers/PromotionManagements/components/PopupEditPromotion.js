import React from "react";
import {
  Input, RadioList,
  TextArea, SelectBox,
  Button, CropImage
} from "../../../components/common";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import BillDiscountEdit from "./listEditDiscount/BillDiscountEdit";
import { FoodDiscountEdit } from "./listEditDiscount/FoodDiscountEdit";
import { ComboDiscountEdit } from "./listEditDiscount/ComboDiscountEdit";
import EditDateApplyPromotion from "./EditDateApplyPromotion";
import moment from "moment";
import VoucherDiscountEdit from "./listEditDiscount/VoucherDiscountEdit";
import Swal from "../../../utils/sweetalert2";
import Validator from "../../../utils/validator";
import { object, string } from "yup";

export default class EditPromotion extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      promotionDetail: this.props.promotionDetail,
      namePromotion: this.props.promotionDetail.name,
      isActive: this.props.promotionDetail.is_active,
      selected: this.props.selected,
      days: {
        monday: this.props.promotionDetail.monday,
        tuesday: this.props.promotionDetail.tuesday,
        wednesday: this.props.promotionDetail.wednesday,
        thursday: this.props.promotionDetail.thursday,
        friday: this.props.promotionDetail.friday,
        saturday: this.props.promotionDetail.saturday,
        sunday: this.props.promotionDetail.sunday
      },
      promoBillDetails: this.props.promoBillDiscountDetail,
      note: this.props.promotionDetail.description,
      image: this.props.promotionDetail.image,
      fromDate: new Date(this.props.promotionDetail.date_start),
      toDate: new Date(this.props.promotionDetail.date_end),
      fromHours: this.props.promotionDetail.hour_start,
      toHours: this.props.promotionDetail.hour_end,
      billDiscountType: this.props.promotionDetail.bill_discount_type,
      foodDiscount: {
        foodDetails: this.props.promoItemDiscountDetail,
        discount: this.props.promotionDetail.discount_item_value
      },
      comboDiscount: {
        comboDetails: this.props.promoComboItemDiscountDetail,
        discount: this.props.promotionDetail.discount_item_value
      },
      promoVoucherDetails: this.props.promoVoucherDetails,
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
  changeFormDiscount = (selected) => {
    this.setState({ selected })
  }

  showDiscount = () => {
    const { ...rest } = this.props
    const { selected } = this.state
    if (selected === 1) {
      return (
        <BillDiscountEdit
          changeBillDetails={
            promoBillDetails =>
              this.setState({ promoBillDetails })
          }
          {...rest}
        />
      )
    } else if (selected === 2) {
      return (
        <FoodDiscountEdit
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
                discount: data
              }
            })
          }}
          {...rest}
        />
      )
    } else if (selected === 3) {
      return (
        <ComboDiscountEdit
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
          {...rest}
        />
      )
    } else if (selected === 4) {
      return (
        <VoucherDiscountEdit
          changeVoucherDetails={(promoVoucherDetails) => this.setState({ promoVoucherDetails })
          }
          {...rest}
        />
      )
    }
  }
  showSuccess = () => {
    const { t } = this.props
    Swal.fire({
      icon: 'success',
      title: `${t("promotions.editSuccess")}!`,
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
   * return data with format {promotion: data}
   * @param {*} list
   * @param {*} days
   * @param {*} details
   */
  concatData = (list, days, details) => {
    let data = {
      promotion: { ...list, ...days },
      ...details
    }
    return data
  }
  saveEditPromotion = (id) => {
    const { t } = this.props
    const { selected, namePromotion, note, isActive, fromDate,
      toDate, fromHours, toHours, days, billDiscountType,
      promoBillDetails, foodDiscount, comboDiscount, promoVoucherDetails
    } = this.state
    if (Object.entries(this.validator.validate(this.state)).length === 0 &&
      this.validator.validate(this.state).constructor === Object) {
      Swal.fire({
        title: `${t("promotions.textNoti")}`,
        text: `${t("promotions.confirmAgain")}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: `${t("promotions.yesAgree")}`,
        cancelButtonText: `${t("promotions.cancel")}`
      }).then(async (result) => {
        if (result.value) {
          const image = await this.cropImage.uploadImage();
          let dataCommon = {
            name: namePromotion,
            is_active: isActive,
            description: note,
            date_start: moment(fromDate).format(),
            date_end: moment(toDate).format(),
            hour_start: fromHours,
            hour_end: toHours,
            promotion_type_id: selected,
            image
          };
          let newData = {};
          let data = {};
          switch (selected) {
            case 1:
              newData = { ...dataCommon, bill_discount_type: billDiscountType };
              data = this.concatData(newData, days, { promotion_bill_details: promoBillDetails });
              this.props.actions.editPromoDiscountBill({
                data, id,
                addSuccess: this.showSuccess,
                addError: this.showErr
              });
              this.props.hide();
              break;
            case 2:
              newData = {
                ...dataCommon,
                discount_item_value: foodDiscount.discount,
                discount_item_type: 1
              }
              data = this.concatData(newData, days, { promotion_items: foodDiscount.foodDetails })
              this.props.actions.editPromoDiscountItem({
                data, id,
                addSuccess: this.showSuccess,
                addError: this.showErr
              });
              this.props.hide();
              break;
            case 3:
              newData = { ...dataCommon, discount_item_value: comboDiscount.discount }
              data = this.concatData(newData, days, { promotion_combo_items: comboDiscount.comboDetails })
              this.props.actions.editPromoDiscountComboItem({
                data, id,
                addSuccess: this.showSuccess,
                addError: this.showErr
              })
              this.props.hide()
              break;
            case 4:
              newData = { ...dataCommon }
              data = this.concatData(newData, days, { promotion_voucher_details: promoVoucherDetails })
              this.props.actions.editPromoDiscountVoucher({
                data, id,
                addSuccess: this.showSuccess,
                addError: this.showErr
              })
              this.props.hide()
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
    const { days, selected, fromDate, toDate, fromHours, toHours,
      isActive, namePromotion, billDiscountType, promotionDetail, errors
    } = this.state
    const { ...rest } = this.props
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
                  onChange={(e) => this.setState({ namePromotion: e.target.value })}
                  defaultValue={namePromotion}
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
                  onChange={(checkActive) => this.setState({ isActive: checkActive })}
                  selected={isActive}
                />
              </div>
            </div>
            <div className="note e-flex item-center">
              <TextArea
                defaultValue={promotionDetail.description}
                placeholder={t("promotions.note")}
                onChange={(e) => this.setState({ note: e.target.value })}
              />
            </div>
          </div>
          <div className="content-name-right e-col-3 e-flex item-center">
            <CropImage
              ref={element => (this.cropImage = element)}
              src={promotionDetail.image}
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
                  map={{
                    key: "id",
                    text: lng === "en" ? "name_en" : lng === "vi" ? "name_vn" : "name_jp"
                  }}
                  selected={selected}
                  disabled={true}
                  onChange={this.changeFormDiscount}
                >
                  <div className="icon-dow disable" >
                    <FontAwesomeIcon icon={faCaretDown} />
                  </div>
                </SelectBox>
              </div>
              <div className="list-radio flex e-flex item-center">
                {selected === 1 ?
                  <RadioList
                    dataSource={[
                      { key: 1, text: `${t("promotions.all")}` },
                      { key: 2, text: `${t("promotions.food")}` },
                      { key: 3, text: `${t("promotions.drink")}` },
                    ]}
                    onChange={billDiscountType =>
                      this.setState({ billDiscountType })
                    }
                    selected={billDiscountType}
                  /> : null}
              </div>
            </div>
            {this.showDiscount()}
          </div>
        </fieldset>
        <fieldset className="time-apply-promo">
          <legend className="title-form">{t("promotions.timeApplication")}</legend>
          <EditDateApplyPromotion
            promotionDetail={promotionDetail}
            fromDate={fromDate}
            changeFromDate={(fromDate) => this.setState({ fromDate })}
            toDate={toDate}
            changeToDate={(toDate) => this.setState({ toDate })}
            fromHours={fromHours}
            changeFromHours={(time, timeString) => this.setState({ fromHours: timeString })}
            toHours={toHours}
            changeToHours={(time, timeString) => this.setState({ toHours: timeString })}
            days={days}
            onChangeDay={days => this.setState({ days })}
            errors={errors}
            {...rest}
          />
        </fieldset>
        <div className="btn-save e-flex content-end">
          <Button type="s5" onClick={() => this.saveEditPromotion(promotionDetail.id)}>{t("promotions.save")}</Button>
        </div>
      </div>
    )
  }
}