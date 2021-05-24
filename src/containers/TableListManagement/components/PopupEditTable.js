import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faTimes,
  faCaretLeft,
  faCaretRight,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import Validator from "../../../utils/validator";
import Slider from "react-slick";
import { partner_id, LANGUAGES } from "../../../consts/constants";
import Swal from "../../../utils/sweetalert2";
import NumberRange from "./../../../components/common/NumberRange";
import PopupChooseTblShape from "./PopupChooseTblShape";
import {
  Input,
  Button,
  ButtonImage,
  TextArea,
  SelectBox,
  CheckBox, CleaveInput, CropList
} from "../../../components/common";
import * as CONSTS from "./../constants";
function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        width: "20px",
        height: "0px",
        position: "absolute",
        top: "28px",
        right: "1px",
      }}
      onClick={onClick}
    >
      <FontAwesomeIcon icon={faCaretRight} style={{ color: "black" }} />
    </div>
  );
}

function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        background: "green",
        width: "20px",
        height: "0px",
        position: "absolute",
        left: "-22px",
        top: "28px",
      }}
      onClick={onClick}
    >
      <FontAwesomeIcon icon={faCaretLeft} style={{ color: "black" }} />
    </div>
  );
}

export default class PopupEditTbl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSelectBoxTblType: false,
      showSelectBoxArea: false,
      showPopupSelectTblShape: false,
      numberTable: this.props.isEdit ? this.props.inFoTable.name : "",
      tableType: this.props.tableType.filter((tableType) => {
        return tableType.id === this.props.inFoTable.table_type.id;
      })[0],
      seatNumber: this.props.inFoTable.seat_number,
      description: this.props.inFoTable.description || "",
      area: this.props.inFoTable.area,
      areaName: this.props.inFoTable.area ? this.props.inFoTable.area.name : "",
      tableStatus: this.props.inFoTable.is_active ? CONSTS.USE : CONSTS.NOT_USE,
      table_imgs: this.props.inFoTable.table_imgs,
      table_imgsl: 0,
      image: [],
      imagesl: 0,
      errors: {},
      tableShape: this.props.inFoTable.image,
      isEdit: this.props.isEdit
    };

    const rules = [
      {
        field: "numberTable",
        method: "isEmpty",
        validWhen: false,
        message: `${this.props.t("tableManagament.validEnterNameTbl")}`,
      },
      {
        field: "seatNumber",
        method: "isEmpty",
        validWhen: false,
        message: "Vui lòng nhập chổ ngồi.",
      },
      {
        field: "tableShape",
        method: "isEmpty",
        validWhen: false,
        message: `${this.props.t("tableManagament.validTableShape")}`,
      },
    ];
    this.validator = new Validator(rules);
  }

  // componentDidMount() {
  //   const numberTable = this.props.inFoTable.name;
  //   const seatNumber = this.props.inFoTable.seat_number;
  //   this.setState({
  //     numberTable,
  //     seatNumber,
  //   });
  // }

  /**
   * Add image
   */
  handlerFile = (event) => {
    var img = [...event.target.files];
    const { image } = this.state;
    var tk = img.concat(image);
    this.setState({
      image: [...tk],
      table_imgsl: -1,
      imagesl: 0,
    });
  };

  /**
   * Remove image
   */
  onRemoveImage = () => {
    const { image, imagesl, table_imgs } = this.state;
    image.splice(imagesl, 1);
    this.setState({
      imagesl: imagesl !== 0 ? imagesl - 1 : imagesl,
      table_imgsl: imagesl === 0 ? table_imgs.length - 1 : -1,
      image: [...image],
    });
  };

  /**
   * Remove saved table image
   */
  onRemoveTableImage = () => {
    const { table_imgs, table_imgsl } = this.state;
    let newTable_imgs = [];
    for (let i = 0; i < table_imgs.length; i++) {
      if (i !== table_imgsl) {
        newTable_imgs.push(table_imgs[i]);
      }
    }
    this.setState({
      table_imgsl: table_imgsl !== 0 ? table_imgsl - 1 : table_imgsl,
      imagesl: table_imgsl === 0 ? 0 : -1,
      table_imgs: [...newTable_imgs],
    });
  };

  /**
   * Edit table success
   */
  editSuccess = () => {
    const { t } = this.props;
    Swal.fire({
      icon: "success",
      title: `${t("tableManagament.updateSuccess")}`,
      showConfirmButton: true,
    });
  };

  addSuccess = () => {
    const { t } = this.props;
    Swal.fire({
      icon: "success",
      title: `${t("Sao chép thành công")}`,
      showConfirmButton: true,
    });
  };
  /**
   * Edit table
   */
  editTable = async () => {
    const {
      numberTable,
      tableType,
      seatNumber,
      description,
      area,
      areaName,
      image,
      tableShape,
      tableStatus, isEdit
    } = this.state;
    const { id } = this.props.inFoTable;
    const { searchByName, searchByArea, t } = this.props;
    if (
      Object.entries(
        this.validator.validate({
          numberTable: `${numberTable}`,
          seatNumber: `${seatNumber}`,
          tableShape: `${tableShape}`,
        })
      ).length === 0 &&
      this.validator.validate({
        numberTable: `${numberTable}`,
        seatNumber: `${seatNumber}`,
        tableShape: `${tableShape}`,
      }).constructor === Object
    ) {
      Swal.fire({
        icon: "warning",
        title: `${t("tableManagament.notification")}`,
        text: `${t("tableManagament.popupUpdate")}`,
        showCancelButton: true,
        confirmButtonText: `${t("tableManagament.agree")}`,
        cancelButtonText: `${t("tableManagament.cancel")}`,
      }).then(async (result) => {
        if (result.value) {
          const images = await this.cropList.uploadImage();
          const item_imgs = images.map(image => ({ image }))
          const data = {
            partner_id,
            name: numberTable,
            name_search: numberTable,
            area_id: area !== undefined ? area.id : this.props.inFoTable.area_id,
            area: {
              id: area !== undefined ? area.id : this.props.inFoTable.area_id,
              name: areaName,
            },
            area_name: areaName,
            seat_number: seatNumber,
            status: 0,
            table_type: tableType,
            table_type_id: tableType.id,
            table_type_name:
              this.props.t("currentLang") === LANGUAGES.vietnam
                ? tableType.name_vn
                : this.props.t("currentLang") === LANGUAGES.english
                  ? tableType.name_en
                  : tableType.name_jp,
            description,
            image: tableShape,
            table_imgs: item_imgs,
            position: 0,
            is_active:
              tableStatus === CONSTS.USE ? CONSTS.CHECKED : CONSTS.NO_CHECKED,
          };
          if (isEdit) {
            this.props.actions.editTable({
              data,
              table_id: id,
              searchByName,
              searchByArea,
              editSuccess: this.editSuccess,
            });
          } else {
            this.props.actions.createTable({
              data,
              searchByName,
              searchByArea,
              image,
              addSuccess: this.addSuccess,
            });
          }
          this.props.hide();
        }
      });
    } else {
      this.setState({
        errors: this.validator.validate({
          numberTable: `${numberTable}`,
          seatNumber: `${seatNumber}`,
          tableShape: `${tableShape}`
        }),
      });
    }
  };

  /**
   * Choose table shape
   */
  onChooseTableShape = (shape) => {
    this.setState({
      tableShape: shape,
    });
  };

  render() {
    const { hide, areaList, t } = this.props;
    const { ...rest } = this.props;
    const {
      tableType,
      areaName,
      errors,
      table_imgs,
      numberTable,
      seatNumber,
      tableStatus,
      showPopupSelectTblShape,
      tableShape,
      area,
    } = this.state;
    var settings = {
      infinite: false,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 1,
      nextArrow: <NextArrow />,
      prevArrow: <PrevArrow />,
    };
    let tableTypeOptions = [];
    if (this.props.tableType && this.props.tableType.length > 0) {
      this.props.tableType.map((tableTypeItem) => {
        tableTypeOptions.push({
          key: tableTypeItem.id,
          text: tableTypeItem.name_vn,
        });
      });
    }
    return (
      <>
        <section
          className="popup-add-new popup-add-table"
        >
          <h3 className="sec-tit text-center popup-add-table__title">
            {this.props.isEdit ? t("tableManagament.popupEdit") : t("tableManagament.title_copy_table")}
          </h3>
          <aside className="inner clear popup-add-table__info">
            <ul className="form-wp form-fields fl table-info__content">
              <li className="flex-view middle table-info__content-item">
                <div className="lbl">
                  {`${t("tableManagament.tableName")} `}
                  <span className="color-must-fill">*</span>
                </div>
                <div className="val-wrap">
                  <CleaveInput
                    value={numberTable}
                    options={{
                      uppercase: true,
                      blocks: [3]
                    }}
                    setValue={(numberTable) =>
                      this.setState({ numberTable })
                    }
                    className="input-name-table"
                  />
                  {errors.numberTable ? (
                    <div className="validation">{errors.numberTable}</div>
                  ) : null}
                </div>
              </li>
              <li className="flex-view middle table-info__content-item">
                <div className="lbl">{t("tableManagament.area")}</div>
                <div className="val-wrap">
                  <aside>
                    <SelectBox
                      dataSource={areaList}
                      selected={area.id}
                      blank={
                        area === null
                          ? t("tableManagament.chooseArea")
                          : areaName
                      }
                      map={{
                        key: "id",
                        text: "name"
                      }}
                      onChange={(areaId, area) => {
                        this.setState({
                          area: areaList.find(
                            (areaItem) => areaItem.id === areaId
                          ),
                          areaName: area.text,
                        });
                      }}
                    >
                      <div className="icon-angle-dow">
                        <FontAwesomeIcon icon={faAngleDown} />
                      </div>
                    </SelectBox>
                  </aside>
                  {errors.areaName ? (
                    <div className="validation">{errors.areaName}</div>
                  ) : null}
                </div>
              </li>

              <li className="flex-view middle table-info__content-item">
                <div className="lbl">{t("tableManagament.tblType")}</div>
                <div className="val-wrap">
                  <aside>
                    <SelectBox
                      dataSource={tableTypeOptions}
                      selected={
                        tableType
                          ? tableType === null
                            ? null
                            : tableType.id
                          : null
                      }
                      blank={
                        tableType === null
                          ? t("tableManagament.chooseTableType")
                          : t("currentLang") === LANGUAGES.vietnam
                            ? tableType.name_vn
                            : t("currentLang") === LANGUAGES.english
                              ? tableType.name_en
                              : tableType.name_jp
                      }
                      onChange={(tableTypeId, tableType) => {
                        this.setState({
                          tableType: this.props.tableType.find(
                            (tableTypeItem) =>
                              tableTypeItem.id === tableTypeId
                          ),
                          tableTypeName: tableType.text,
                        });
                      }}
                    >
                      <div className="icon-angle-dow">
                        <FontAwesomeIcon icon={faAngleDown} />
                      </div>
                    </SelectBox>
                  </aside>
                  {errors.tableTypeName ? (
                    <div className="validation">{errors.tableTypeName}</div>
                  ) : null}
                </div>
              </li>
              <li className="flex-view middle table-info__content-item">
                <div className="lbl">
                  {`${t("tableManagament.numseat")} `}
                  <span className="color-must-fill">*</span>
                </div>
                <div className="val-wrap number-range" style={{ width: 240 }}>
                  <NumberRange
                    max={50}
                    min={1}
                    defaultValue={seatNumber}
                    onChange={(seatNumber) =>
                      this.setState({ seatNumber: seatNumber })
                    }
                  />
                  {errors.seatNumber ? (
                    <div className="validation">{errors.seatNumber}</div>
                  ) : null}
                </div>
              </li>

              <li className="flex-view middle table-info__content-item">
                <div className="lbl">{t("tableManagament.status")}</div>
                <div className="check-box">
                  <CheckBox
                    name="checkbox"
                    label={t("tableManagament.use")}
                    checked={tableStatus === CONSTS.USE}
                    onChange={(isCheck) => {
                      if (isCheck === true) {
                        this.setState({
                          tableStatus: CONSTS.USE,
                        });
                      } else {
                        this.setState({
                          tableStatus: CONSTS.NOT_USE,
                        });
                      }
                    }}
                  />
                  <CheckBox
                    name="checkbox"
                    label={t("tableManagament.notUse")}
                    checked={tableStatus === CONSTS.NOT_USE}
                    onChange={(isCheck) => {
                      if (isCheck === true) {
                        this.setState({
                          tableStatus: CONSTS.NOT_USE,
                        });
                      } else {
                        this.setState({
                          tableStatus: CONSTS.USE,
                        });
                      }
                    }}
                  />
                </div>
              </li>
              <li className="flex-view middle table-info__content-item">
                <div className="lbl">{t("tableManagament.note")}</div>
                <div className="val-wrap">
                  <TextArea
                    name="Text1"
                    defaultValue={this.state.description}
                    onChange={(description) =>
                      this.setState({ description: description.target.value })
                    }
                  ></TextArea>
                </div>
              </li>
            </ul>
            <CropList
              images={table_imgs}
              ref={e => {
                this.cropList = e
              }}
              textAdd={t("dishManagament.addimg")}
              title={t("dishManagament.editImg")}
              btnChoseFile={t("dishManagament.chooseImg")}
              btnDone={t("dishManagament.swalAgree")}
            />
            <div className="upload-wp fr table-info__shape">
              <fieldset className="table-info__shape-container">
                <legend className="shape__title">
                  {`${t("tableManagament.legendChooseTable")} `}
                  <span className="color-must-fill">*</span>
                </legend>
                <div className="shape__content">
                  {tableShape ? (
                    <>
                      <img
                        src={tableShape}
                        className="img-choose-shape"
                        alt=""
                      />
                      <ButtonImage
                        className="btn-choose-shape"
                        onClick={() => {
                          this.setState({
                            showPopupSelectTblShape: true,
                          });
                          this.props.actions.loadTableShape();
                        }}
                      >
                        {t("tableManagament.chooseAgain")}
                      </ButtonImage>
                    </>
                  ) : (
                      <>
                        <img
                          className="img-choose-shape"
                          src={require("./../../../images/omenu_logo.png")}
                          alt=""
                        />
                        <ButtonImage
                          className="btn-choose-shape"
                          onClick={() => {
                            this.setState({
                              showPopupSelectTblShape: true,
                            });
                            this.props.actions.loadTableShape();
                          }}
                        >
                          {t("tableManagament.chooseTbl")}
                        </ButtonImage>
                      </>
                    )}
                </div>
              </fieldset>
              {errors.tableShape ? (
                <div className="validation text-center">
                  {errors.tableShape}
                </div>
              ) : null}
            </div>
          </aside>

          <aside className="acts text-center">
            <Button
              type="s3"
              style={{ marginRight: 5 }}
              onClick={() => {
                this.props.hide();
              }}
            >
              {t("tableManagament.back")}
            </Button>

            <Button onClick={this.editTable}>
              {t("tableManagament.save")}
            </Button>
          </aside>
        </section>
        {showPopupSelectTblShape ? (
          <PopupChooseTblShape
            onHide={() =>
              this.setState({
                showPopupSelectTblShape: !showPopupSelectTblShape,
              })
            }
            onChooseTableShape={this.onChooseTableShape}
            seatNumber={seatNumber}
            tableShape={tableShape}
            t={t}
            {...rest}
          ></PopupChooseTblShape>
        ) : null}
      </>
    );
  }
}
