import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  RadioList,
  CheckBox,
  Button,
  TextArea,
  SelectBox,
  Input,
  CropImage,
  CropList,
  CleaveInput,
  TagInput,
  Dialog,
} from "./../../../components/common";
import {
  faAngleDown,
} from "@fortawesome/free-solid-svg-icons";
import Validator from "../../../utils/validator";
import "./popupAddDish.scss";
import Swal from "./../../../utils/sweetalert2";
import * as CONSTS from "./../constants"
import PopupChoseAddon from "./PopupChoseAddon";
import "./popupChooseAddon.scss"

export default class PopoupEditDish extends Component {
  constructor(props) {
    super(props);
    const { dishInfo } = this.props.dishInfo;
    this.state = {
      showSeleteBoxTypeDish: false,
      showSeleteBoxUnitDish: false,
      nameSearch: "",
      nameDish: "",
      typeDish: dishInfo.catagory_name,
      typeDishId: "",
      unitDish: dishInfo.unit_name,
      unitDishId: "",
      unitPrice: dishInfo.sale_price,
      skuDish: dishInfo.sku,
      skuDishCopy: dishInfo.sku,
      tax: dishInfo.is_vat,
      note: "",
      item_imgs: dishInfo.item_imgs,
      image: "",
      imagesl: 0,
      status: false,
      errors: {},
      selected: 0,
      selectedGroupType: 0,
      id_food: "",
      regular_price: 0,
      in_stock: true,
      position: 1,
      des_short: "",
      is_recommend: true,
      is_popular: true,
      is_new: true,
      group_type: 0,
      created_at: "",
      updated_at: "",
      slickIndex: 0,
      isBar: false,
      isCheckPrice: dishInfo.is_open_price ? dishInfo.is_open_price : false,
      showAddonList: false,
      addonListEdit: [],
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
      {
        field: "skuDish",
        method: () => {
          for (var i = 0; i < this.props.itemList.length; i++) {
            if (this.props.itemList[i].sku === this.state.skuDishCopy) {
              continue;
            }
            if (this.state.skuDish === this.props.itemList[i].sku) {
              return true;
            }
          }
          return false;
        },
        validWhen: false,
        message: t("dishManagament.messageInvalidForSameId"),
      },
      {
        field: "skuDish",
        method: "isEmpty",
        validWhen: false,
        message: t("dishManagament.messageInvalidForEmptyId"),
      },
     /*  {
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

    ];
    this.validator = new Validator(rules);
    this.wrapperRef = React.createRef();
  }


  componentDidMount() {
    const { dishInfo } = this.props.dishInfo;
    this.setState({
      nameDish: dishInfo.name,
      typeDishId: dishInfo.category_id,
      unitPrice: dishInfo.sale_price.toString(),
      image: dishInfo.image_large,
      item_imgs: dishInfo.item_imgs,
      unitDish: dishInfo.unit_item.name,
      typeDish: dishInfo.category_item.name,
      note: dishInfo.des_full,
      skuDish: dishInfo.sku,
      skuDishCopy: dishInfo.sku,
      status: dishInfo.status,
      unitDishId: dishInfo.unit_id,
      selected: dishInfo.status,
      selectedGroupType: dishInfo.group_type,
      id_food: dishInfo.id,
      regular_price: dishInfo.regular_price,
      in_stock: dishInfo.in_stock,
      position: dishInfo.position,
      des_short: dishInfo.des_short,
      is_recommend: dishInfo.is_recommend,
      is_popular: dishInfo.is_popular,
      is_new: dishInfo.is_new,
      group_type: dishInfo.group_type,
      created_at: dishInfo.created_at,
      updated_at: dishInfo.updated_at,
      nameSearch: dishInfo.name_search,
      isBar: dishInfo.is_bar,
      tax: dishInfo.is_vat,
      category_item: {
        id: dishInfo.category_id,
        name: dishInfo.category_item.name
      },
      unit_item: {
        id: dishInfo.unit_item.name,
        name: dishInfo.unit_item.name
      },
      addonListEdit: dishInfo.addon_items,
      isCheckPrice: dishInfo.is_open_price
    });
  }

  onEditDish = () => {
    const { t } = this.props;
    const {
      nameDish,
      skuDish,
      typeDish,
      typeDishId,
      unitDish,
      unitDishId,
      unitPrice,
      regular_price,
      tax,
      note,
      item_imgs,
      image,
      status,
      id_food,
      in_stock,
      position,
      des_short,
      is_recommend,
      is_popular,
      is_new,
      group_type,
      created_at,
      updated_at,
      nameSearch,
      isBar,
      isCheckPrice,
      addonListEdit
    } = this.state;

    let data = {
      des_full: note,
      name: nameDish,
      sku: skuDish,
      sale_price: isCheckPrice === true ? 0 : parseInt(unitPrice || 0),
      is_vat: tax,
      image: image,
      unit_id: unitDishId,
      category_name: typeDish,
      status: status,
      category_id: typeDishId,
      id: id_food,
      regular_price,
      in_stock,
      position,
      des_short,
      is_recommend,
      is_popular,
      is_new,
      group_type,
      created_at,
      updated_at,
      item_imgs,
      name_search: nameSearch,
      is_bar: isBar,
      category_item: {
        id: typeDishId,
        name: typeDish
      },
      unit_item: {
        id: unitDishId,
        name: unitDish
      },
      addon_items: addonListEdit,
      is_open_price: isCheckPrice
    }
    const { id } = this.props.dishInfo.dishInfo;
    if (Object.entries(this.validator.validate(this.state)).length === 0 &&
      this.validator.validate(this.state).constructor === Object) {
      Swal.fire({
        title: t("dishManagament.swalTitle"),
        text: t("dishManagament.swalUpdateDish"),
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: t("dishManagament.swalAgree"),
        cancelButtonText: t("dishManagament.swalCancel"),
      }).then(async (result) => {
        if (result.value) {
          this.props.actions.startLoading();
          const image = await this.cropImageBig.uploadImage();
          const images = await this.cropList.uploadImage();
          const item_imgs = images.map(image => ({ image }))
          data = {
            ...data,
            item_imgs,
            image_large: image,
            image: images[0]
          }
          this.props.actions.editItem({
            data,
            food_id: id,
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
  /**
    * TODO - delete
  */
  showAlert = () => {
    const t = this.props.t;
    Swal.fire({
      title: t("dishManagament.swalTitle"),
      text: t("dishManagament.swalUpdateDish"),
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: t("dishManagament.swalAgree"),
      cancelButtonText: t("dishManagament.swalCancel"),
    }).then((result) => {
      if (result.value) {
        this.onEditDish();
      }
    })
  }
  showOk = () => {
    const { t } = this.props;
    Swal.fire({
      icon: 'success',
      text: t("dishManagament.swalUpdateSuccess"),
      title: t("dishManagament.swalTitle")
    })
  }

  showErr = () => {
    const { t } = this.props;
    Swal.fire({
      icon: 'error',
      title: t("dishManagament.swalTitle"),
      text: t("dishManagament.swalUpdateFail")
    })
  }

  changeUnit = (selected, item) => {
    this.setState({
      unitDish: item.text,
      unitDishId: selected
    })
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

  onSubmitDataCheck = (data) => {
    this.setState({
      addonListEdit: data.map(item => {
        return { id: item.id, name: item.name }
      }),
      showAddonList: false
    })
  }

  onDeleteAddon = (tag) => {
    const { addonListEdit } = this.state
    this.setState({
      addonListEdit:
        addonListEdit.filter(item => item.id !== tag.id)
    })
  }

  render() {
    const { t, unitItemList, categoryItem, infoVatSetting } = this.props;
    const { dishInfo } = this.props.dishInfo;
    const { ...rest } = this.props;
    const {
      unitPrice,
      errors,
      selected,
      selectedGroupType,
      note,
      skuDish,
      tax,
      isBar,
      image,
      item_imgs,
      isCheckPrice,
      showAddonList,
      addonListEdit
    } = this.state;

    let selectedAddons = [];
    for (let i in addonListEdit) {
      selectedAddons[i] = addonListEdit[i].id
    }

    const listCategory = [];
    let temp_category = {};
    for (let i = 0; i < categoryItem.length; i++) {
      temp_category = {
        key: categoryItem[i].id,
        text: categoryItem[i].name
      }
      listCategory.push(temp_category);
    }
    const listUnit = [];
    let temp_unit = {};
    for (let i = 0; i < unitItemList.length; i++) {
      temp_unit = {
        key: unitItemList[i].id,
        text: unitItemList[i].name
      }
      listUnit.push(temp_unit);
    }

    const listTax = [
      { key: true, text: t("dishManagament.yes") },
      { key: false, text: t("dishManagament.no_") },
    ]

    const listStatus = [
      { key: 1, text: t("dishManagament.still") },
      { key: 0, text: t("dishManagament.over") },
    ]
    const listGroupType = [
      { key: 1, text: t("dishManagament.food") },
      { key: 2, text: t("dishManagament.drink") },
      { key: 3, text: t("dishManagament.other") },
    ];
    return (
      <>
        <div className="content-add-item-food popup-add-new">
          <h3 className="sec-tit text-center">
            {t("dishManagament.popupEdit")}
          </h3>
          <aside className="e-row e-flex">
            <div className="content-left e-col-6">
              <ul className="form-fields-food flex">
                <li className="it flex-view middle">
                  <div className="lbl">{t("dishManagament.kind")}<span className="tick-red">*</span></div>
                  <div className="val-wrap">
                    <RadioList
                      name="type"
                      dataSource={listGroupType}
                      onChange={selectedGroupType => this.setState({ selectedGroupType, group_type: selectedGroupType })}
                      selected={selectedGroupType}
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
                      />
                    </div>
                  </SelectBox>
                </li>
                <li className="it flex-view middle">
                  <div className="lbl">{t("dishManagament.dishName")} <span className="tick-red">*</span></div>
                  <div className="val-wrap">
                    <Input
                      type="text"
                      defaultValue={dishInfo.name}
                      onChange={(e) =>
                        this.setState({
                          nameDish: e.target.value,
                          nameSearch: e.target.value.normalize('NFD')
                            .replace(/[\u0300-\u036f]/g, '')
                            .replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase()
                        })
                      }
                    />
                    {errors.nameDish ? (
                      <div className="validation">{errors.nameDish}</div>
                    ) : null}
                  </div>
                </li>
                <li className="it flex-view middle">
                  <div className="lbl">{`${t("dishManagament.code")}`}
                    <span className="tick-red">*</span></div>
                  <div className="val-wrap">
                    <Input
                      type="text"
                      defaultValue={skuDish}
                      onChange={e =>
                        this.setState({
                          skuDish: e.target.value
                        })
                      }
                    />
                    {errors.skuDish ? (
                      <div className="validation">{errors.skuDish}</div>
                    ) : null}
                  </div>
                </li>
                <li className="it flex-view middle">
                  <div className="lbl">{t("dishManagament.unit")}</div>
                  <SelectBox
                    onChange={(selected, item) => this.changeUnit(selected, item)}
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
                  <div className="val-wrap field-input-price" style={{ height: "50px" }}>
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
                        setValue={(unitPrice) => {
                          this.setState({
                            unitPrice
                          })
                        }
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
                        dataSource={addonListEdit ? addonListEdit : []}
                        iconColor="#f27922"
                        map={{
                          text: "name",
                          key: "id"
                        }}
                        selected={selectedAddons}
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
                      onChange={selected => this.setState({ selected, status: selected })}
                      selected={selected}
                    />
                  </div>
                </li>
                <li className="it flex-view middle">
                  <div className="lbl">{t("dishManagament.note")}</div>
                  <div className="val-wrap">
                    <TextArea
                      defaultValue={note}
                      onChange={e =>
                        this.setState({
                          note: e.target.value
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
            <div className="content-right e-col-6 e-row no-wrap">
              <div className="fixed-image">
                <div className="image-title">{t("dishManagament.image")} 1:2</div>
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
                  images={item_imgs}
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
          </aside>
          <aside className="acts text-center" style={{ width: "100%", marginTop: "1em", fontSize: "14px" }}>
            <Button type="s3" style={{ marginRight: 5 }} onClick={() => { this.props.hide() }}>
              {t("dishManagament.back")}
            </Button>
            <Button onClick={this.onEditDish}>
              {t("dishManagament.edit")}
            </Button>
          </aside>
        </div>
        <Dialog
          show={showAddonList}
          close={() => this.setState({ showAddonList: false })}
          title={t("dishManagament.listAddon")}
          innerClass="popup-list-food"
        >
          <PopupChoseAddon
            onSubmitDataCheck={this.onSubmitDataCheck}
            addonListEdit={this.state.addonListEdit}
            showAddonList={() => this.setState({ showAddonList: false })}
            selected={selectedAddons}
            hide={() => this.setState({ showAddonList: false })}
            {...rest}
          />
        </Dialog>
      </>
    );
  }
}
