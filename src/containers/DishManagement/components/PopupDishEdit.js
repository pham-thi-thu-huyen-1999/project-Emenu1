import React from "react";
import "./addDish.scss"
import ButtonRadio from "../../../components/common/RadioList";
import Input from "../../../components/common/Input"
import TagInput from "../../../components/common/TagInput";
import Dialog from "../../../components/common/Dialog";
import PopupChoseListFood from "./PopupChoseListFood";
import Button from "../../../components/common/Button";
import Swal from '../../../../src/utils/sweetalert2';
import Validator from "../../../utils/validator";
import { LIMIT_ITEM } from "../../../consts/settings/dish/dish";
import {
  ButtonImage, NumberRange
} from "../../../components/common";
import CleaveInput from "../../../components/common/CleaveInput";
import PopupChooseDishIcon from "./PopupChooseDishIcon";

export default class PopupDishEdit extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showListFood: false,
      nameDish: this.props.comboItemDetail.name,
      priceDish: this.props.comboItemDetail.price,
      isPrice: this.props.comboItemDetail.is_price,
      comboItemDetails: this.props.comboItemDetail.items,
      comboItemDetailsBefore: this.props.comboItemDetail.items,
      image: this.props.comboItemDetail.image,
      errors: {},
      comboItemDetail: this.props.dishEdit,
      status: this.props.dishEdit.status,
      showPopupChooseDishIcon: false,
      position: this.props.dishEdit.position ? this.props.dishEdit.position : 1
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
      }
    ]
    this.validator = new Validator(rules)
  }
  showSuccess = () => {
    const { t } = this.props
    Swal.fire({
      icon: 'success',
      title: `${t("dishManagaments.editSuccess")}!`,
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
  onEditDish = (id) => {
    const { nameDish, status, priceDish,
      isPrice, image, comboItemDetails, position } = this.state
    const { t } = this.props
    if (Object.entries(this.validator.validate(this.state)).length === 0 &&
      this.validator.validate(this.state).constructor === Object) {
      Swal.fire({
        title: `${t("dishManagaments.sure")}`,
        text: `${t("dishManagaments.textValidateEdit")}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: `${t("dishManagament.swalAgree")}`,
        cancelButtonText: `${t("dishManagaments.cancel")}`,
      }).then(async (result) => {
        if (result.value) {
          var data = {
            combo_item_id: id,
            name: nameDish,
            is_price: isPrice,
            price: priceDish,
            status,
            image,
            combo_item_imgs: [],
            items: comboItemDetails,
            page: this.props.page,
            position
          }
          this.props.actions.editCombo({
            data,
            combo_item_id: id,
            callSuccess: this.showSuccess,
            callFail: this.showErr
          })
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
  componentWillReceiveProps(nextProps) {
    if (nextProps.comboItemDetail) {
      this.setState({
        comboItemDetail: nextProps.comboItemDetail
      })
    }
  }
  onChooseListFood = () => {
    this.setState({
      showListFood: true
    })
    this.props.actions.getItems({ page: 1, limit: LIMIT_ITEM })
  }

  onSubmitDataCheck = (data) => {
    this.setState({
      comboItemDetails: data.map(item => {
        return { id: item.id, name: item.name }
      }),
      showListFood: false
    })
  }
  deleteItem = (tag) => {
    const { comboItemDetails } = this.state
    this.setState({
      comboItemDetails:
        comboItemDetails.filter(item => item.id !== tag.id)
    })
  }

  getNew = (olds, news) => {
    let newItems = []
    olds.some(o => {
      const check = news.find(n => {
        if (n.item_id === o.item_id) {
          return true
        }
      })
      if (!check) {
        newItems = [...newItems, o]
      }
    })

    news.some(n => {
      const check = olds.find(o => {
        if (n.item_id === o.item_id) {
          return true
        }
      })
      if (!check) {
        newItems = [...newItems, { ...n, id: '' }]
      }
    })

    return newItems
  }

  onChooseDishIcon = (dishIcon) => {
    this.setState({
      image: dishIcon,
    });
  };
  render() {
    const { ...rest } = this.props;
    const { t, dishEdit } = this.props;
    const { showListFood, isPrice, errors,
      nameDish, priceDish, comboItemDetails
    } = this.state;
    let selected = [];
    for (let i in comboItemDetails) {
      selected[i] = comboItemDetails[i].id
    }
    return (
      <>
        <div className="e-dialog-content popup-edit-dish">
          <div className="e-dialog-body">
            <div className="e-row">
              <div className="e-form e-row e-flex-column flex">
                <div className="e-form-field e-row">
                  <label className="e-col-2 e-form-label flex e-flex">
                    {t("dishManagaments.dishName")}<span style={{ color: "#de5959" }}>*</span>
                  </label>
                  <div className="e-col-10">
                    <Input
                      name="nameDish"
                      defaultValue={nameDish}
                      onChange={nameDish => this.setState({ nameDish: nameDish.target.value })}
                    />
                    {errors.nameDish ?
                      <div className="validation">{`${t("dishManagaments.validateNameDish")}`}</div> : null
                    }
                  </div>
                </div>
                <div className="e-form-field e-row inclue-dish">
                  <label className="e-col-2 e-form-label flex e-flex">
                    {t("dishManagaments.includingDishs")}
                  </label>
                  <div className="e-col-10 e-flex item-center">
                    {
                      <TagInput
                        onAction={this.onChooseListFood}
                        dataSource={this.state.comboItemDetails}
                        iconColor="#f27922"
                        map={{
                          key: "id",
                          text: "name",
                        }}
                        selected={selected}
                        onChange={this.deleteItem}
                      >
                      </TagInput>
                    }
                  </div>
                </div>
                <div className="e-form-field form-field-price e-row e-flex item-center">
                  <label className="e-col-2 e-form-label flex e-flex noneAlign">
                    {t("dishManagaments.price")}<span style={{ color: "#de5959" }}>*</span>
                  </label>
                  <div className="e-col-10 field-listss field-price e-inlineBlock align-center">
                    <ButtonRadio
                      className="field-radio"
                      dataSource={[
                        { key: true, text: t("dishManagaments.yes") },
                        { key: false, text: t("dishManagaments.no") }
                      ]}
                      onChange={isPrice => this.setState({ isPrice })
                      }
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
                <div className="e-form-field e-row">
                  <label className="e-col-2 e-form-label flex e-flex">
                    {t("dishManagaments.status")}
                  </label>
                  <div className="e-col-10 e-col-9 field-listss e-flex item-center">
                    <ButtonRadio
                      name="status"
                      className="field-radio"
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
              <Button type="s3" onClick={() => this.props.hide()}>{t("dishManagaments.back")}</Button>
            </span>
            <span>
              <Button onClick={() => this.onEditDish(dishEdit.id)}>{t("dishManagaments.save")}</Button>
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
            comboItemDetails={this.state.comboItemDetails}
            showListFood={() => this.setState({ showListFood: false })}
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