import React, { Component } from "react";
import {
  RadioList,
  Button,
  TextArea,
  Input,
  CropImage,
  CleaveInput
} from "../../../components/common";
import Validator from "../../../utils/validator";
import Swal from "../../../utils/sweetalert2";
import _ from "lodash";
import * as CONSTS from "./../constants";
export default class PopoupEditAddon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAddon: {},
      name: "",
      tax: "",
      description: "",
      image: "",
      price: 0,
      status: "",
      position: 0,
      errors: {}
    };
    const t = this.props.t;
    const rules = [
      {
        field: "name",
        method: "isEmpty",
        validWhen: false,
        message: t("addonManagement.messageInvalidForEmptyName"),
      },
      {
        field: "price",
        method: "isEmpty",
        validWhen: false,
        message: t("addonManagement.messageInvalidForEmptyCost"),
      },

      {
        field: "price",
        method: "isNumeric",
        validWhen: true,
        message: t("addonManagement.messageInvalidANumber"),
      },

    ];
    this.validator = new Validator(rules);
    this.wrapperRef = React.createRef();
  }

  checkRules = () => {
    if (Object.entries(this.validator.validate(this.state)).length === 0 &&
      this.validator.validate(this.state).constructor === Object) {
      this.setState({
        errors: {},
      })
    } else {
      this.setState({
        errors: this.validator.validate(this.state),
      });
    }
  }

  onChangeName = async (e) => {
    await this.setState({
      name: e.target.value,
      nameSearch: e.target.value.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase()
    })
    this.checkRules();
  };

  onChangePrice = async (price) => {
    await this.setState({
      price: price + ""
    })
    this.checkRules();
  };

  onEditDish = () => {
    const { t, nameSearch } = this.props;
    const {
      name,
      price,
      description,
      tax,
      status,
      position,
    } = this.state;

    let data = {
      "name": name,
      "price": price,
      "image": "",
      "is_vat": tax,
      "in_stock": true,
      "position": position,
      "descr": description,
      "status": status,
    }
    const { id } = this.props.selectedAddon;
    if (Object.entries(this.validator.validate(this.state)).length === 0 &&
      this.validator.validate(this.state).constructor === Object) {
      Swal.fire({
        title: t("addonManagement.swalTitleEdit"),
        text: t("addonManagement.swalMessageEdit"),
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: t("addonManagement.swalAgree"),
        cancelButtonText: t("addonManagement.swalCancel"),
      }).then(async (result) => {
        if (result.value) {
          this.props.actions.startLoading();
          const image = await this.cropImage.uploadImage();
          data = {
            ...data,
            image
          }

          let dataGetAddons = {
            page: CONSTS.PAGE,
            limit: CONSTS.LIMIT,
            name_search: nameSearch
          }

          this.props.actions.editAddon({
            data,
            addon_item_id: id,
            dataGetAddons,
            callback_success: this.showOk,
            callback_fail: this.showErr
          })
          this.props.hide();
        }
      })
    } else {
      this.setState({
        errors: this.validator.validate(this.state)
      });
    }
  };

  showOk = () => {
    const { t } = this.props;
    Swal.fire({
      icon: 'success',
      title: t("addonManagement.swalTitleEdit"),
      text: t("addonManagement.swalMessageEditSuccess")
    })
  }

  showErr = () => {
    const { t } = this.props;
    Swal.fire({
      icon: 'error',
      title: t("addonManagement.swalTitleEdit"),
      text: t("addonManagement.swalMessageEditFail")
    })
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (_.isEmpty(prevState.selectedAddon) === true && _.isEmpty(nextProps.selectedAddon) === false) {
      return {
        selectedAddon: nextProps.selectedAddon,
        name: nextProps.selectedAddon.name,
        tax: nextProps.selectedAddon.is_vat,
        image: nextProps.selectedAddon.image,
        price: nextProps.selectedAddon.price + "",
        description: nextProps.selectedAddon.descr,
        status: nextProps.selectedAddon.status,
        position: nextProps.selectedAddon.position,
      }
    }
    return null;
  }

  render() {
    const { t, infoVatSetting } = this.props;
    const {
      name,
      price,
      errors,
      description,
      tax,
      image,
      status,
      position,
    } = this.state;

    const listTax = [
      { key: true, text: t("addonManagement.yes") },
      { key: false, text: t("addonManagement.no_") },
    ]

    const listStatus = [
      { key: 1, text: t("addonManagement.still") },
      { key: 0, text: t("addonManagement.over") },
    ]

    return (
      <div className="content-create-addon popup-add-new">
        <h3 className="sec-tit text-center">
          {t("addonManagement.titlePopupEditAddon")}
        </h3>
        <aside className="e-row e-flex">
          <div className="content-left e-col-6">
            <ul className="form-fields-food flex">
              <li className="it flex-view middle">
                <div className="lbl">{t("addonManagement.nameAddon")} <span className="tick-red">*</span></div>
                <div className="val-wrap">
                  <Input
                    type="text"
                    defaultValue={name}
                    onChange={this.onChangeName}
                  />
                  {errors.name ? (
                    <div className="validation">{errors.name}</div>
                  ) : null}
                </div>
              </li>
              <li className="it flex-view middle">
                <div className="lbl">{t("addonManagement.price")}</div>
                <div className="val-wrap field-input-price">
                  <CleaveInput
                    value={price}
                    setValue={this.onChangePrice}
                  /><span className="unit-price">đ</span>
                  {errors.price ? (
                    <div className="validation">{errors.price}</div>
                  ) : null}
                </div>
              </li>

              <li className="it flex-view middle">
                <div className="lbl">{t("addonManagement.position")}</div>
                <div className="val-wrap">
                  <Input
                    type="number"
                    defaultValue={position}
                    onChange={e => this.setState({position: e.target.value})}
                  />
                  {errors.name ? (
                    <div className="validation">{errors.name}</div>
                  ) : null}
                </div>
              </li>
              <li className="it flex-view middle">
                <div className="lbl">
                  {t("addonManagement.tax")} ({this.props.infoVatSetting.vat}%)
                </div>
                <div className="val-wrap tax-input">
                  <RadioList
                    name="tax"
                    dataSource={listTax}
                    onChange={tax => this.setState({ tax })}
                    selected={infoVatSetting && infoVatSetting.is_vat ? tax : false}
                    disabled={infoVatSetting && !infoVatSetting.is_vat}
                  />
                </div>
              </li>
              <li className="it flex-view middle">
                <div className="lbl">{t("addonManagement.status")}</div>
                <div className="val-wrap tax-input">
                  <RadioList
                    name="status"
                    dataSource={listStatus}
                    onChange={selected => this.setState({ selected, status: selected })}
                    selected={status}
                  />
                </div>
              </li>
              <li className="it flex-view middle">
                <div className="lbl">{t("addonManagement.description")}</div>
                <div className="val-wrap">
                  <TextArea
                    defaultValue={description}
                    onChange={e =>
                      this.setState({
                        description: e.target.value
                      })
                    }
                  />
                </div>
              </li>
            </ul>
          </div>
          <div className="e-flex content-center e-col-6 e-row no-wrap">
            <div className="fixed-image">
              <div className="image-title">{t("addonManagement.image")} 1:1</div>
              <CropImage
                ratio={1 / 1}
                src={image}
                name="crop-image-big"
                ref={e => {
                  this.cropImage = e
                }}
                textAdd={t("addonManagement.addimg")}
                title={t("addonManagement.editImg")}
                btnChoseFile={t("addonManagement.chooseImg")}
                btnDone={t("addonManagement.swalAgree")}
              />
            </div>
          </div>
        </aside>
        <aside className="acts text-center" style={{ width: "100%", marginTop: "1em", fontSize: "14px" }}>
          <Button type="s3" style={{ marginRight: 5 }} onClick={() => { this.props.hide() }}>
            {t("addonManagement.back")}
          </Button>
          <Button onClick={this.onEditDish}>
            {t("addonManagement.edit")}
          </Button>
        </aside>
      </div>
    );
  }
}
