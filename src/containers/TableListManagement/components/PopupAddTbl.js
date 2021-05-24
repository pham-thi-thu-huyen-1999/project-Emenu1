import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faTimes,
  faCaretRight,
  faCaretLeft,
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

export default class PopupAddTbl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSelectBoxTblType: false,
      showSelectBoxArea: false,
      showPopupSelectTblShape: false,
      numberTable: null,
      tableType: null,
      tableTypeName: "",
      seatNumber: 1,
      description: null,
      tableStatus: true,
      area: null,
      areaName: "",
      image: [],
      imagesl: 0,
      errors: {},
      checked: CONSTS.USE,
      tableShape: null,
    };
    const rules = [
      {
        field: "numberTable",
        method: "isEmpty",
        validWhen: false,
        message: `${this.props.t("tableManagament.validEnterNameTbl")}`,
      },
      {
        field: "tableTypeName",
        method: "isEmpty",
        validWhen: false,
        message: `${this.props.t("tableManagament.validSelectTableType")}`,
      },
      {
        field: "areaName",
        method: "isEmpty",
        validWhen: false,
        message: `${this.props.t("tableManagament.validSelectArea")}`,
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

  /**
   * Add image
   */
  handlerFile = (event) => {
    var img = [...event.target.files];
    const { image } = this.state;
    var tk = img.concat(image);
    // image.forEach(item=>{
    //   img=img.push(item);
    // })
    this.setState({
      image: [...tk],
    });
  };

  /**
   * Remove image
   */
  onRemoveImage = () => {
    const { image, imagesl } = this.state;

    image.splice(imagesl, 1);
    this.setState({
      imagesl: imagesl !== 0 ? imagesl - 1 : imagesl,
      image: [...image],
    });
  };

  /**
   * Add table success
   */
  addSuccess = () => {
    const { t } = this.props;
    Swal.fire({
      icon: "success",
      title: `${t("tableManagament.addSuccess")}`,
      showConfirmButton: true,
    });
  };

  /**
   * Add table
   */
  addTable = () => {
    const {
      numberTable,
      area,
      tableType,
      seatNumber,
      description,
      image,
      tableShape,
      checked,
    } = this.state;
    console.log(numberTable)
    const { searchByName, searchByArea, t } = this.props;
    if (
      Object.entries(this.validator.validate(this.state)).length === 0 &&
      this.validator.validate(this.state).constructor === Object
    ) {
      Swal.fire({
        icon: "warning",
        title: `${t("tableManagament.notification")}`,
        text: `${t("tableManagament.popupAdd")}`,
        showCancelButton: true,
        confirmButtonText: `${t("tableManagament.agree")}`,
        cancelButtonText: `${t("tableManagament.cancel")}`,
      }).then(async (result) => {
        if (result.value) {
          const images = await this.cropList.uploadImage();
          let table_imgs = images.map(image => ({ image }))
          const data = {
            partner_id,
            name: numberTable,
            name_search: numberTable,
            area_id: area !== null ? area.id : null,
            room: "Vip",
            seat_number: seatNumber,
            status: 0,
            table_type_id: tableType !== null ? tableType.id : null,
            description,
            image: tableShape,
            position: 0,
            is_active: checked === CONSTS.USE ? CONSTS.CHECKED : CONSTS.NO_CHECKED,
            table_imgs
          };
          this.props.actions.createTable({
            data,
            searchByName,
            searchByArea,
            image,
            addSuccess: this.addSuccess,
          });
          this.props.hide();
        }
      });
    } else {
      this.setState({
        errors: this.validator.validate(this.state),
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
    const { areaList, hide, t } = this.props;
    const { ...rest } = this.props;
    const {
      showPopupSelectTblShape,
      area,
      tableType,
      errors,
      image,
      tableShape,
      checked,
      seatNumber,
    } = this.state;
    var settings = {
      infinite: false,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 1,
      nextArrow: <NextArrow />,
      prevArrow: <PrevArrow />,
    };
    // let areaOptions = [];
    // if (areaList && areaList.length > 0) {
    //   areaList.map((areaItem) => {
    //     areaOptions.push({
    //       key: areaItem.id,
    //       text: areaItem.name,
    //     });
    //   });
    // }

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
            {t("tableManagament.moreTbls")}
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
                      selected={
                        area ? (area === null ? null : area.id) : null
                      }
                      blank={
                        area === null
                          ? t("tableManagament.chooseArea")
                          : area.name
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
                          areaName: area.name,
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
                <div className="val-wrap number-range">
                  <NumberRange
                    max={50}
                    min={1}
                    defaultValue={this.state.seatNumber}
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
                    checked={checked === CONSTS.USE}
                    onChange={(isCheck) => {
                      if (isCheck === true) {
                        this.setState({
                          checked: CONSTS.USE,
                        });
                      } else {
                        this.setState({
                          checked: CONSTS.NOT_USE,
                        });
                      }
                    }}
                  />

                  <CheckBox
                    name="checkbox"
                    label={t("tableManagament.notUse")}
                    checked={checked === CONSTS.NOT_USE}
                    onChange={(isCheck) => {
                      if (isCheck === true) {
                        this.setState({
                          checked: CONSTS.NOT_USE,
                        });
                      } else {
                        this.setState({
                          checked: CONSTS.USE,
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
                    onChange={(description) =>
                      this.setState({ description: description.target.value })
                    }
                  ></TextArea>
                </div>
              </li>
            </ul>
            <CropList
              ref={e => {
                this.cropList = e
              }}
              textAdd={t("dishManagament.addimg")}
              title={t("dishManagament.editImg")}
              btnChoseFile={t("dishManagament.chooseImg")}
              btnDone={t("dishManagament.swalAgree")}
            />
            {/* {image.length === 0 ? (
                <label href="#" className="upload-btn">
                  <input
                    multiple
                    type="file"
                    className="hide"
                    defaultValue=""
                    ref={(el) => (this.inputImage = el)}
                    onChange={(image) =>
                      this.setState({
                        image: [...image.target.files],
                      })
                    }
                  />
                  <img
                    className="uploaded_image"
                    src={require("./../../../images/omenu_logo.png")}
                    width="75"
                    height="75"
                    alt=""
                  />
                  <ButtonImage className="btn-choose-image">
                    {t("tableManagament.addImg")}
                  </ButtonImage>
                </label>
              ) : (
                  <div className="addimage">
                    <input
                      multiple
                      type="file"
                      style={{ display: "none" }}
                      defaultValue=""
                      ref={(fileIP) => (this.fileIP = fileIP)}
                      onChange={this.handlerFile}
                    />
                    <FontAwesomeIcon
                      onClick={() => this.fileIP.click()}
                      className="imagesle"
                      icon={faPlus}
                      style={{ fontSize: "23px", color: "white" }}
                    />
                  </div>
                )}
              {image.length !== 0 ? (
                <div className="uploaded-img">
                  <img
                    className="imagesle"
                    src={URL.createObjectURL(image[imagesl])}
                    alt=""
                  />
                  <span className="remove-btn" onClick={this.onRemoveImage}>
                    <FontAwesomeIcon
                      icon={faTimes}
                      style={{ fontWeight: "600px" }}
                    />
                  </span>
                </div>
              ) : null}
              {image.length !== 0 ? (
                <div
                  className="slickimage table-info__image-slick"
                  style={{ paddingLeft: "33px" }}
                >
                  <Slider {...settings}>
                    {image.map((item, index) => (
                      <div key={index}>
                        <div
                          className={`contentslick ${index === imagesl ? "activeimage" : null
                            }`}
                          onClick={() => {
                            this.setState({ imagesl: index });
                          }}
                        >
                          <img
                            className="imagesle"
                            src={URL.createObjectURL(item)}
                            alt=""
                          />
                        </div>
                      </div>
                    ))}
                  </Slider>
                </div>
              ) : null} */}
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
              {t("tableManagament.return")}
            </Button>

            <Button onClick={this.addTable}>
              {t("tableManagament.save")}
            </Button>
          </aside>
        </section>
        {showPopupSelectTblShape ? (
          <PopupChooseTblShape
            onHide={() => this.setState({ showPopupSelectTblShape: false })}
            onChooseTableShape={(tableShape) => {
              this.onChooseTableShape(tableShape);
            }}
            seatNumber={seatNumber}
            tableShape={tableShape}
            {...rest}
          ></PopupChooseTblShape>
        ) : null}
      </>
    );
  }
}
