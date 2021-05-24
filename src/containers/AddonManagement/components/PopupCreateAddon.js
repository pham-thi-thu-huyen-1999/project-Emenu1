import React, { Component } from "react";
import {
  RadioList, Button, Input,
  CropImage, TextArea, CropList,
  CleaveInput
} from "../../../components/common";
import Swal from "../../../utils/sweetalert2";
import Validator from "../../../utils/validator";
import * as CONSTS from "./../constants"
export default class PopupCreateAddon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      price: 0,
      tax: this.props.infoVatSetting.is_vat,
      description: "",
      image: "",
      errors: {},
      status: 1,
      position: 0,
      hasSubmit: false
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

  componentWillUnmount() {
    document.removeEventListener("click", this.handleClick);
  }
 
  handleClick = event => {
    const { target } = event;
    if (this.wrapperRef.current === null) {
      return;
    }
    if (!this.wrapperRef.current.contains(target)) {
      if (this.state.image.length === 0) {
      } else {
        this.props.hide();
      }
    }
  };

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
    const { hasSubmit } = this.state;
    await this.setState({
      name: e.target.value
    })
    if (hasSubmit) {
      this.checkRules();
    }
  };

  onChangePrice = async (price) => {
    const { hasSubmit } = this.state;
    await this.setState({
      price
    })
    if (hasSubmit) {
      this.checkRules();
    }
  };

  onCreateAddon = async () => {
    const { t , nameSearch } = this.props;
    const {
      name,
      price,
      tax,
      status,
      description,
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
      "status": status
    };
    
    if (Object.entries(this.validator.validate(this.state)).length === 0 &&
      this.validator.validate(this.state).constructor === Object) {
      Swal.fire({
        title: t("addonManagement.swalTitleCreate"),
        text: t("addonManagement.swalMessageCreate"),
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
            image: image
          }

          let dataGetAddons = {
            page: CONSTS.PAGE,
            limit: CONSTS.LIMIT,
            name_search: nameSearch
          }
          this.props.actions.createAddon({
            data,
            dataGetAddons,
            callback_success: this.showOk,
            callback_fail: this.showErr,
          });
          this.props.hide();
        }
      })
    } else {
      this.setState({
        hasSubmit: true,
        errors: this.validator.validate(this.state),
      });
    }
  };

  showOk = () => {
    const t = this.props.t;
    Swal.fire({
      icon: 'success',
      text: t("addonManagement.swalMessageCreateSuccess"),
      title: t("addonManagement.swalTitleCreate")
    })
  }

  showErr = () => {
    const t = this.props.t;
    Swal.fire({
      icon: 'error',
      title: t("addonManagement.swalTitleCreate"),
      text: t("addonManagement.swalMessageCreateFail")
    })
  }
  render() {
    const { hide, t, infoVatSetting } = this.props;
    const {
      errors,
      image,
      status,
      tax,
      price
    } = this.state;

    var listStatus = [
      { key: 1, text: t("addonManagement.still") },
      { key: 0, text: t("addonManagement.over") },
    ]

    var listTax = [
      { key: true, text: t("addonManagement.yes") },
      { key: false, text: t("addonManagement.no_") },
    ]
    return (
      <div className="content-create-addon popup-add-new">
        <h3 className="sec-tit text-center">
          {t("addonManagement.titlePopupCreateAddon")}
        </h3>
        <aside className="e-row e-flex">
          <div className="content-left e-col-6 ">
            <ul className="form-fields-food flex">

              <li className="it flex-view middle">
                <div className="lbl">{t("addonManagement.nameAddon")}<span className="tick-red">*</span></div>
                <div className="val-wrap">
                  <Input
                    type="text"
                    defaultValue=""
                    onChange={this.onChangeName}
                  />
                  {errors.name ? (
                    <div className="validation">{errors.name}</div>
                  ) : null}
                </div>
              </li>
  
              <li className="it flex-view middle">
                <div className="lbl">{t("addonManagement.price")}<span className="tick-red">*</span></div>
                <div className="val-wrap field-input-price">
                  <CleaveInput
                    value={price}
                    setValue={this.onChangePrice}
                  />
                  <span className="unit-price">đ</span>
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
                    placeholder={0}
                    onChange={ e => this.setState({position: e.target.value})}
                  />
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
                    onChange={status =>
                      this.setState({ status })}
                    selected={status}
                  />
                </div>
              </li>
              <li className="it flex-view middle">
                <div className="lbl">{t("addonManagement.description")}</div>
                <div className="val-wrap">
                  <TextArea
                    name="description"
                    rows={3}
                    onChange={(description) =>
                      this.setState({
                        description: description.target.value,
                      })
                    }
                  />
                </div>
              </li>
            </ul>
          </div>
          <div className="content-right e-col-6 e-row">
            <div className="content-right-top e-col-12">
              <div className="upload-image">
                <div className="fixed-image">
                  <div className="image-title">
                    {t("addonManagement.image")} 1:1</div>
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
            </div>
          </div>
        </aside>
        <aside className="acts text-center">
          <Button type="s3" style={{ marginRight: 5 }}
            onClick={() => { hide() }}>
            {t("addonManagement.back")}
          </Button>
          <Button
            onClick={this.onCreateAddon}
          >
            {t("addonManagement.add")}
          </Button>
        </aside>
      </div >
    );
  }
}

