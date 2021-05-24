import React from "react";
import "./addDish.scss"
import ButtonRadio from "../../../components/common/RadioList";
import Input from "../../../components/common/Input";
import TagInput from "../../../components/common/TagInput";
import Dialog from "../../../components/common/Dialog";
import PopupChoseListFood from "./PopupChoseListFood";
import { Button, NumberRange } from "../../../components/common/index";
import Swal from '../../../../src/utils/sweetalert2';
import Validator from "../../../utils/validator";
import { LIMIT_ITEM } from "../../../consts/settings/dish/dish";
import {
  ButtonImage,
} from "../../../components/common";
import PopupChooseDishIcon from "./PopupChooseDishIcon";
import CleaveInput from "../../../components/common/CleaveInput";


export default class PopupDishAdd extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showListFood: false,
      dataIsCheck: [],
      isPrice: false,
      nameDish: "",
      priceDish: 0,
      errors: {},
      selected: [],
      status: 1,
      image: "",
      showPopupChooseDishIcon: false,
      position: 1
    };
    const rules = [
      {
        field: "nameDish",
        method: "isEmpty",
        validWhen: false,
        message: "message",
      },
      {
        field: "priceDish",
        method: (priceDish, state) => {
          if (state.isPrice) {
            if (priceDish > 0) {
              return true
            }
            else {
              return false
            }
          } else {
            return true
          }
        },
        validWhen: true,
        message: "message",
      },
      {
        field: "image",
        method: "isEmpty",
        validWhen: false,
        message: "message",
      },
    ]
    this.validator = new Validator(rules)
  }
  onChooseListFood = () => {
    this.setState({
      showListFood: true
    })
    this.props.actions.getItems({ page: 1, limit: LIMIT_ITEM })
  }
  onSubmitDataCheck = (dataIsCheck) => {
    this.setState({ dataIsCheck, showListFood: false })
  }
  showSuccess = () => {
    const { t } = this.props
    Swal.fire({
      icon: 'success',
      title: `${t("dishManagaments.addSuccess")}!`,
      showConfirmButton: true,
    })
  }
  showErr = () => {
    const { t } = this.props
    Swal.fire({
      icon: 'error',
      title: `${t("dishManagaments.error")}!`,
      text: `${t("dishManagaments.requCheckAgain")}!`
    })
  }
  onAddDish = () => {
    const { isPrice, nameDish, priceDish, dataIsCheck, status, image, position } = this.state
    const { t } = this.props
    if (Object.entries(this.validator.validate(this.state)).length === 0 &&
      this.validator.validate(this.state).constructor === Object) {
      Swal.fire({
        title: `${t("dishManagaments.sure")}`,
        text: `${t("dishManagaments.textValidateAdd")}`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: `${t("dishManagament.swalAgree")}`,
        cancelButtonText: `${t("dishManagaments.cancel")}`,
      }).then(async (result) => {
        if (result.value) {
          const data = {
            name: nameDish,
            is_price: isPrice,
            price: priceDish,
            image,
            status,
            items: dataIsCheck,
            combo_item_imgs: [],
            page: this.props.page,
            position
          }
          this.props.actions.createCombo({
            data,
            call_success: this.showSuccess,
            call_fail: this.showErr
          });
          this.props.hide();
        }
      })
      this.setState({
        errors: {}
      })
    } else {
      this.setState({
        errors: this.validator.validate(this.state)
      })
    }
  }
  onDeleteItem = (tag) => {
    let result = this.state.dataIsCheck.filter(item => item.id !== tag.id);
    this.setState({ dataIsCheck: result })
  }
  onChooseDishIcon = (dishIcon) => {
    this.setState({
      image: dishIcon,
    });
  };

  render() {
    const { showListFood, dataIsCheck, errors, isPrice, priceDish } = this.state;
    const { ...rest } = this.props
    const { t } = this.props
    let selected = []
    for (let i in dataIsCheck) {
      selected[i] = dataIsCheck[i].id
    }
    return (
      <>
        <div className="e-dialog-content">
          <div className="e-dialog-body">
            <div className="e-row">
              <div className="e-form e-row e-flex-column flex">
                <div className="e-form-field e-row">
                  <label className="e-col-2 e-form-label">
                    {`${t("dishManagaments.dishName")}`}<span style={{ color: "#de5959" }}>*</span>
                  </label>
                  <div className="e-col-10">
                    <Input
                      name="nameDish"
                      defaultValue={this.state.nameDish}
                      onChange={nameDish => this.setState({ nameDish: nameDish.target.value })}
                    />
                    {errors.nameDish ?
                      <div className="validation">{`${t("dishManagaments.validateNameDish")}`}</div> : ""
                    }
                  </div>
                </div>
                <div className="e-form-field e-row inclues-dish">
                  <label className="e-col-2 e-form-label flex epriceDish: price.target.value-flex">
                    {t("dishManagaments.includingDishs")}
                  </label>
                  <div className="e-col-10 e-flex item-center">
                    <TagInput
                      onAction={this.onChooseListFood}
                      dataSource={dataIsCheck}
                      iconColor="#f27922"
                      map={{
                        text: "name",
                        key: "id"
                      }}
                      selected={selected}
                      onChange={this.onDeleteItem}
                    >
                    </TagInput>
                  </div>
                </div>
                <div className="e-form-field form-field-price e-row e-flex item-center">
                  <label className="e-col-2 e-form-label flex e-flex noneAlign">
                    {`${t("dishManagaments.price")}`}<span style={{ color: "#de5959" }}>*</span>
                  </label>
                  <div className="e-col-10 e-flex field-listss field-price e-inlineBlock align-center">
                    <ButtonRadio
                      className="field-radio"
                      dataSource={[
                        { key: true, text: t("dishManagaments.yes") },
                        { key: false, text: t("dishManagaments.no") }
                      ]}
                      onChange={isPrice => this.setState({ isPrice })}
                      selected={isPrice}
                    />
                    {
                      this.state.isPrice ?
                        <div className="enter-input-price flex">
                          <CleaveInput
                            name="priceDish"
                            value={priceDish}
                            setValue={(priceDish) =>
                              this.setState({
                                priceDish
                              })
                            }
                          />
                          <span className="unit-price">đ</span>
                          {errors.priceDish ?
                            <div className="validation">{`${t("dishManagaments.validatePriceDish")}`}</div> : null
                          }
                        </div>
                        : ""
                    }
                  </div>
                </div>
                <div className="e-form-field e-row align-center">
                  <label className="e-col-2 e-form-label flex e-flex">
                    {t("dishManagaments.status")}
                  </label>
                  <div className="e-col-10 e-flex field-listss">
                    <ButtonRadio
                      className="field-radio"
                      name="status"
                      dataSource={[
                        { key: 1, text: `${t("dishManagaments.isStatus")}` },
                        { key: 0, text: `${t("dishManagaments.noStatus")}` }
                      ]}
                      onChange={status => this.setState({ status })
                      }
                      selected={this.state.status}
                    />
                  </div>
                </div>
                <div className="priority e-flex item-center">
                  <label className="e-col-2 e-form-label flex e-flex">
                    {t("Độ ưu tiên")}
                  </label>
                  <div className="e-col-10 e-flex field-listss">
                    <NumberRange
                      defaultValue={this.state.position}
                      max={10}
                      onChange={position => this.setState({ position })}
                    />
                  </div>
                </div>
              </div>
              <div className="e-p-left-20 upload-wp fr dish-info__dish">
                <fieldset className="dish-info__dish-container">
                  <legend className="dish__title">
                    {`${t("dishManagament.titleOfChooseDishIcon")} `}
                  </legend>
                  <div className="dish__content">
                    {this.state.image !== "" ? (
                      <>
                        <img
                          src={this.state.image}
                          className="img-choose-dish"
                          alt=""
                        />
                        <ButtonImage
                          className="btn-choose-dish"
                          onClick={() => {
                            this.setState({
                              showPopupChooseDishIcon: true,
                            });
                            this.props.actions.loadDishIcon();
                          }}
                        >
                          {t("dishManagament.chooseAgain")}
                        </ButtonImage>
                      </>
                    ) : (
                        <>
                          <img
                            className="img-choose-dish"
                            src={require("./../../../images/omenu_logo.png")}
                            alt=""
                          />
                          <ButtonImage
                            className="btn-choose-dish"
                            onClick={() => {
                              this.setState({
                                showPopupChooseDishIcon: true,
                              });
                              this.props.actions.loadDishIcon();
                            }}
                          >
                            {t("dishManagament.add")}
                          </ButtonImage>
                        </>
                      )}
                  </div>
                </fieldset>
                {errors.image ?
                  <div className="validation text-center mgTop10">{`${t("dishManagaments.validateIconDish")}`}</div> : ""
                }
              </div>
            </div>
          </div>
          <div className="e-flex content-end">
            <span className="e-m-right-10">
              <Button className="s3" onClick={() => this.props.hide()}>{t("dishManagaments.cancel")}</Button>
            </span>
            <span>
              <Button onClick={this.onAddDish}>{t("dishManagaments.save")}</Button>
            </span>
          </div>
        </div>
        <Dialog
          show={showListFood}
          close={() => this.setState({ showListFood: false })}
          title={t("dishManagaments.listItem")}
          innerClass="popup-list-food"
        >
          <PopupChoseListFood
            onSubmitDataCheck={this.onSubmitDataCheck}
            comboItemDetails={dataIsCheck}
            selected={selected}
            hide={() => this.setState({ showListFood: false })}
            {...rest}
          />
        </Dialog>
        {this.state.showPopupChooseDishIcon ? (
          <PopupChooseDishIcon
            onHide={() => this.setState({ showPopupChooseDishIcon: false })}
            onChooseDishIcon={(dishIcon) => {
              this.onChooseDishIcon(dishIcon);
            }}
            {...rest}
          ></PopupChooseDishIcon>
        ) : null}
      </>
    )
  }
}