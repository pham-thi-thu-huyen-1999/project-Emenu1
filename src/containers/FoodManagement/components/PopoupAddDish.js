import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  RadioList, Button, CheckBox,
  SelectBox, Input,
  CropImage, TextArea, CropList,
  CleaveInput, Dialog, TagInput
} from "./../../../components/common";
import Swal from "./../../../utils/sweetalert2";
import {
  faAngleDown
} from "@fortawesome/free-solid-svg-icons";
import Validator from "../../../utils/validator";
import "./popupAddDish.scss";
import * as CONSTS from "./../constants";
import PopupChoseAddon from "./PopupChoseAddon";
import "./popupChooseAddon.scss"
export default class PopoupAddDish extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSelectBoxTypeDish: false,
      showSelectBoxUnitDish: false,
      nameDish: "",
      skuDish: "",
      typeDish: this.props.categoryItem.length ? this.props.categoryItem[0].name : "",
      typeDishId: this.props.categoryItem.length ? this.props.categoryItem[0].id : "",
      unitDish: this.props.unitItemList.length ? this.props.unitItemList[0].name : "",
      unitDishId: this.props.unitItemList.length ? this.props.unitItemList[0].id : "",
      unitPrice: 0,
      regular_price: 0,
      tax: this.props.infoVatSetting.is_vat,
      note: "",
      image: "",
      imagesl: 0,
      errors: {},
      selectedStatus: 1,
      selectedType: 1,
      isBar: false,
      filterCategory: null,
      filterUnit: null,
      source: "",
      listImage: [],
      isCheckPrice: false, //Chon gia mon an theo thoi gia
      showAddonList: false,
      dataIsCheck: [],
    };
    const t = this.props.t;
    const rules = [
      {
        field: "nameDish",
        method: "isEmpty",
        validWhen: false,
        message: t("dishManagament.messageInvalidForEmptyName"),
      },
      {
        field: "skuDish",
        method: "isEmpty",
        validWhen: false,
        message: t("dishManagament.messageInvalidForEmptyId"),
      },
      /* {
        field: "unitPrice",
        method: "isEmpty",
        validWhen: false,
        message: t("dishManagament.messageInvalidForEmptyCost"),
      },

      {
        field: "unitPrice",
        method: "isNumeric",
        validWhen: true,
        message: t("dishManagament.messageInvalidANumber"),
      }, */
      {
        field: "skuDish",
        method: () => {
          for (var i = 0; i < this.props.itemList.length; i++) {
            if (this.state.skuDish === this.props.itemList[i].sku) {
              return true;
            }
          }
          return false;
        },
        validWhen: false,
        message: t("dishManagament.messageInvalidForSameId"),
      },

    ];
    this.validator = new Validator(rules);
    this.wrapperRef = React.createRef();
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.handleClick);
  }
  getGenerateById = () => {
    const skuDish = this.props.generateId;
    this.setState({
      skuDish
    })
  };
  onGenerateId = () => {
    var name = this.state.nameDish;
    const { t } = this.props;
    if (name !== "") {
      this.props.actions.getGenerateById({ data: { name }, callback: this.getGenerateById });
    } else {
      Swal.fire({
        title: t("dishManagament.swalTitle"),
        text: t("dishManagament.messageForCreateIdWithoutName"),
        icon: 'info',
        confirmButtonText: t("dishManagament.swalAgree"),
      })
    }
  };

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

  onChangeNameDish = (e) => {
    this.setState({
      nameDish: e.target.value
    })
  };

  onAddDish = async () => {
    const { t } = this.props;
    const {
      nameDish, skuDish,
      typeDishId, unitDishId,
      unitPrice, regular_price,
      tax, note,
      selectedType, image,
      selectedStatus, isBar,
      isCheckPrice,
      typeDish, unitDish, dataIsCheck,
    } = this.state;
    let data = {
      name: nameDish,
      sku: skuDish,
      name_search: nameDish.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase(),
      regular_price: parseInt(regular_price),
      sale_price: isCheckPrice === true ? 0 : parseInt(unitPrice || 0),
      image,
      is_vat: tax,
      in_stock: true,
      position: 0,
      des_full: note,
      des_short: "",
      is_recommend: false,
      is_popular: false,
      is_new: true,
      group_type: selectedType,
      category_id: typeDishId,
      unit_id: unitDishId,
      status: selectedStatus,
      item_imgs: [],
      is_bar: isBar,
      category_item: {
        id: typeDishId,
        name: typeDish
      },
      unit_item: {
        id: unitDishId,
        name: unitDish
      },
      addon_items: dataIsCheck,
      is_open_price: isCheckPrice
    };
    if (Object.entries(this.validator.validate(this.state)).length === 0 &&
      this.validator.validate(this.state).constructor === Object) {
      Swal.fire({
        title: t("dishManagament.swalTitle"),
        text: t("dishManagament.swalAddDish"),
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: t("dishManagament.swalAgree"),
        cancelButtonText: t("dishManagament.swalCancel"),
      }).then(async (result) => {
        if (result.value) {
          this.props.actions.startLoading();
          const image = await this.cropImageBig.uploadImage();
          const images = await this.cropList.uploadImage();
          let item_imgs = images.map(image => ({ image }))
          data = {
            ...data,
            image: images[0],
            image_large: image,
            item_imgs
          }
          this.props.actions.createItem({
            data,
            callback_success: this.showOk,
            callback_fail: this.showErr,
          });
          this.props.hide();
        }
      })
    } else {
      this.setState({
        errors: this.validator.validate(this.state),
      });
    }
  };
  showOk = () => {
    const t = this.props.t;
    Swal.fire({
      icon: 'success',
      text: t("dishManagament.swalAddSuccess"),
      title: t("dishManagament.swalTitle")
    })
  }

  showErr = () => {
    const t = this.props.t;
    Swal.fire({
      icon: 'error',
      title: t("dishManagament.swalTitle"),
      text: t("dishManagament.swalAddFail")
    })
  }

  onDeleteAddon = (tag) => {
    let result = this.state.dataIsCheck.filter(item => item.id !== tag.id);
    this.setState({ dataIsCheck: result })
  }

  onShowAddonList = () => {
    this.setState({
      showAddonList: true
    })
    const data = {
      page: 1,
      limit: CONSTS.LIMIT_ADDON
    }
    this.props.actions.getAddonList({ data })
  }

  onSubmitDataCheck = (dataIsCheck) => {
    this.setState({ dataIsCheck, showAddonList: false })
  }

  render() {
    const { hide, t, unitItemList, categoryItem, infoVatSetting } = this.props;
    const {
      errors,
      image,
      selectedStatus,
      skuDish,
      selectedType,
      isBar,
      tax,
      unitPrice,
      isCheckPrice,
      dataIsCheck,
      showAddonList,
    } = this.state;
    const { ...rest } = this.props;
    var listCategory = [];
    var temp_category = {};
    for (var i = 0; i < categoryItem.length; i++) {
      temp_category = {
        key: categoryItem[i].id,
        text: categoryItem[i].name
      }
      listCategory.push(temp_category);
    }
    var listUnit = [];
    var temp_unit = {};
    for (var i = 0; i < unitItemList.length; i++) {
      temp_unit = {
        key: unitItemList[i].id,
        text: unitItemList[i].name
      }
      listUnit.push(temp_unit);
    }

    var listStatus = [
      { key: 1, text: t("dishManagament.still") },
      { key: 0, text: t("dishManagament.over") },
    ]

    var listTax = [
      { key: true, text: t("dishManagament.yes") },
      { key: false, text: t("dishManagament.no_") },
    ]

    const data = [
      { key: 1, text: t("dishManagament.food") },
      { key: 2, text: t("dishManagament.drink") },
      { key: 3, text: t("dishManagament.other") }
    ]

    let selected = []
    for (let i in dataIsCheck) {
      selected[i] = dataIsCheck[i].id
    }
    return (
      <>
        <div className="content-add-item-food popup-add-new">
          <h3 className="sec-tit text-center">
            {t("dishManagament.moreDish")}
          </h3>
          <aside className="e-row e-flex">
            <div className="content-left e-col-6 ">
              <ul className="form-fields-food flex">
                <li className="it flex-view middle">
                  <div className="lbl">{t("dishManagament.type")}<span className="tick-red">*</span></div>
                  <div className="val-wrap">
                    <RadioList
                      name="type"
                      dataSource={data}
                      onChange={selectedType => this.setState({ selectedType })}
                      selected={selectedType}
                    />
                  </div>
                </li>
                <li className="it flex-view middle">
                  <div className="lbl">{t("dishManagament.category")}<span className="tick-red">*</span></div>
                  <SelectBox
                    onChange={(selected, item) => this.setState({ typeDish: item, typeDishId: selected })}
                    dataSource={listCategory}
                    selected={this.state.typeDishId}
                  >
                    <div className="icon-angle-dow">
                      <FontAwesomeIcon
                        icon={faAngleDown}
                      /></div>
                  </SelectBox>
                </li>
                <li className="it flex-view middle">
                  <div className="lbl">{t("dishManagament.dishName")}<span className="tick-red">*</span></div>
                  <div className="val-wrap">
                    <Input
                      type="text"
                      defaultValue=""
                      onChange={this.onChangeNameDish}
                    />
                    {errors.nameDish ? (
                      <div className="validation">{errors.nameDish}</div>
                    ) : null}
                  </div>
                </li>
                <li className="it flex-view middle">
                  <div className="lbl">{t("dishManagament.code")}<span className="tick-red">*</span></div>
                  <div className="val-wrap">
                    <div className="code-food">
                      <Input
                        className="input-code"
                        type="text"
                        value={skuDish ? skuDish : ''}
                        onChange={skuDish =>
                          this.setState({
                            skuDish: skuDish.target.value
                          })
                        }
                      />
                      {'  '}
                      <div className="button-code-auto">
                        <Button
                          onClick={() =>
                            this.onGenerateId()
                          }
                          style={{ marginBottom: "-22px" }}
                        >{t("dishManagament.generateId")}</Button>
                      </div>

                    </div>
                    {errors.skuDish ? (
                      <div className="validation">{errors.skuDish}</div>
                    ) : null}
                  </div>
                </li>
                <li className="it flex-view middle">
                  <div className="lbl">{t("dishManagament.unit")}</div>
                  <SelectBox
                    onChange={(selected, item) => this.setState({ unitDish: item, unitDishId: selected })}
                    dataSource={listUnit}
                    selected={this.state.unitDishId}
                  >
                    <div className="icon-angle-dow">
                      <FontAwesomeIcon
                        icon={faAngleDown}
                      />
                    </div>
                  </SelectBox>
                </li>
                <li className="it flex-view middle">
                  <div className="lbl">{t("dishManagament.price")}</div>
                  <div className="val-wrap field-input-price" style={{ height: "50px"}}>
                    {isCheckPrice === true
                    ?
                      <CleaveInput
                        value={0}
                        disabled={true}
                        className="cursor-not-allow"
                      />
                    :
                    <CleaveInput
                      value={unitPrice}
                      setValue={(unitPrice) =>
                                  this.setState({
                                    unitPrice
                                  })
                              }
                    />
                    }
                    <span className="unit-price">đ</span>
                    {errors.unitPrice && unitPrice !== 0 ? (
                      <div className="validation">{errors.unitPrice}</div>
                    ) : null}
                  </div>
                </li>
                <li className={`it flex-view middle establish-food e-flex content-center ${errors.unitPrice && unitPrice !== 0 ? "e-m-top-10" : ""}`}>
                  <div className="lbl"></div>
                  <div className="val-wrap">
                    <CheckBox
                      name="checkboxPrice"
                      className="check-box-establish"
                      label={t("dishManagament.checkPrice")}
                      checked={isCheckPrice}
                      onChange={(e) => {
                        this.setState({ isCheckPrice: e });
                      }}
                    />
                  </div>
                </li>
                <li className="it flex-view middle">
                  <div className="lbl">Chọn Addon</div>
                  <div className="val-wrap">
                    <TagInput
                        onAction={this.onShowAddonList}
                        dataSource={dataIsCheck}
                        iconColor="#f27922"
                        map={{
                          text: "name",
                          key: "id"
                        }}
                        selected={selected}
                        onChange={this.onDeleteAddon}
                      >
                    </TagInput>
                  </div>
                </li>
                <li className="it flex-view middle">
                  <div className="lbl">
                    {t("dishManagament.tax")} ({this.props.infoVatSetting.vat}%)
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
                  <div className="lbl">{t("dishManagament.status")}</div>
                  <div className="val-wrap tax-input">
                    <RadioList
                      name="status"
                      dataSource={listStatus}
                      onChange={selectedStatus =>
                        this.setState({ selectedStatus })}
                      selected={selectedStatus}
                    />
                  </div>
                </li>
                <li className="it flex-view middle">
                  <div className="lbl">{t("dishManagament.note")}</div>
                  <div className="val-wrap">
                    <TextArea
                      name="note"
                      onChange={(note) =>
                        this.setState({
                          note: note.target.value,
                        })
                      }
                    />
                  </div>
                </li>
                <li className="it flex-view middle establish-food e-flex content-center">
                  <div className="lbl"></div>
                  <div className="val-wrap">
                    <CheckBox
                      name="checkboxBar"
                      className="check-box-establish"
                      label={t("dishManagament.bar")}
                      checked={isBar}
                      onChange={(e) => {
                        this.setState({ isBar: e });
                      }}
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
                      {t("dishManagament.image")} 1:2</div>
                    <CropImage
                      innerClass="dish-image-big"
                      ratio={1 / 2}
                      src={image}
                      name="crop-image-big"
                      ref={e => {
                        this.cropImageBig = e
                      }}
                      textAdd={t("dishManagament.addimg")}
                      title={t("dishManagament.editImg")}
                      btnChoseFile={t("dishManagament.chooseImg")}
                      btnDone={t("dishManagament.swalAgree")}
                    />
                  </div>
                  <div>
                    <div className="image-title">{t("dishManagament.image")} 1:1</div>
                    <CropList
                      ref={e => {
                        this.cropList = e
                      }}
                      textAdd={t("dishManagament.addimg")}
                      title={t("dishManagament.editImg")}
                      btnChoseFile={t("dishManagament.chooseImg")}
                      btnDone={t("dishManagament.swalAgree")}
                    />
                  </div>
                </div>
              </div>
            </div>
          </aside>
          <aside className="acts text-center">
            <Button type="s3" style={{ marginRight: 5 }}
              onClick={() => { hide() }}>
              {t("dishManagament.back")}
            </Button>
            <Button
              onClick={this.onAddDish}
            >
              {t("dishManagament.add")}
            </Button>
          </aside>
        </div >
        <Dialog
          show={showAddonList}
          close={() => this.setState({ showAddonList: false })}
          title={t("dishManagament.listAddon")}
          innerClass="popup-list-food"
        >
          <PopupChoseAddon
            onSubmitDataCheck={this.onSubmitDataCheck}
            comboItemDetails={dataIsCheck}
            selected={selected}
            hide={() => this.setState({ showAddonList: false })}
            {...rest}
          />
        </Dialog>
      </>
    );
  }
}

