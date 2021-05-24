import React, { Component } from "react";
// import Slider from "react-slick";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle/* , faCheck */ } from "@fortawesome/free-solid-svg-icons";
// import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import {
  faSyncAlt
} from "@fortawesome/free-solid-svg-icons";
import "../../../../TakeAwayScreen/components/Category.scss";
import Validator from "../../../../../utils/validator";
import { NumberRange, TableData, Dialog, Button, TextArea, Input, CheckBox } from "../../../../../components/common";
import Swal from "../../../../../utils/sweetalert2";

export default class PopupSelectedFoodList extends Component {
  constructor(props) {
    super(props);
    const { t } = this.props;
    this.state = {
      showPopupConfirm: false,
      showAddNote: false,
      dishSelected: {},
      newNote: "",
      isChecked: false,
      arr_isChecked: [this.props.dishList.map((item) => { return item.is_takeaway ? item.is_takeaway : false })],
      isCheckedAll: false,
      errors: {},
      TABLE_SETTING: {
        heads: [
          {
            text: t("takeaway.number"),
            width: "5%"
          },
          {
            // text: t("takeaway.takeaway"),
            text: () => {
              return (
                <>
                  <CheckBox
                    onChange={(e) => { this.onCheckBoxAll(e) }}
                    className="e-m-right-5"
                    checked={this.state.isCheckedAll}>
                  </CheckBox>
                  {t("takeaway.takeaway")}
                </>
              )
            },
            width: "12%",
          },
          {
            text: t("takeaway.nameFood"),
            width: "25%"
          },
          {
            text: t("takeaway.note"),
            width: "20%"
          },
          {
            text: t("takeaway.quantity"),
            width: "15%"
          },
          {
            text: t("takeaway.price"),
            width: "10%"
          },
          {
            text: t("takeaway.priced"),
            width: "15%"
          },
        ],
        columns: [
          {
            key: "id",
            width: "5%",
            render: (item, index) => {
              return index + 1;
            },
          },
          {
            key: "takeaway",
            width: "12%",
            render: (item, i) => (
              <>
                {
                  this.state.isCheckedAll === ""
                    ?
                    <CheckBox
                      onChange={(e) => this.onCheckbox(e, i)}
                      key={i}
                      checked={item.is_takeaway ? item.is_takeaway : false}></CheckBox>
                    :
                    <CheckBox
                      onChange={(e) => this.onCheckbox(e, i)}
                      key={i}
                      checked={this.state.isCheckedAll === true ? true : false}></CheckBox>
                }
              </>
            ),
          },
          {
            key: "name",
            width: "25%",
          },
          {
            key: "note",
            width: "20%",
          },
          {
            key: "qty",
            width: "15%",
            render: (item, i) => (

              <NumberRange min={1} max={20} defaultValue={item.qty}
                onChange={(quantity) => { this.props.onChangeQuantity(i, quantity) }}
              />
            )
          },
          {
            key: "price",
            width: "10%",
          },
          {
            key: "total",
            width: "15%",
          },
          {
            key: "acts",
            width: "",
            actions: [(item, i) => (
              <>
                <div
                  className="s-btn e-m-right-5"
                  onClick={(e) => this.setState({
                    showAddNote: true,
                    dishSelected: { index: i, ...item },
                  })}
                >
                  <FontAwesomeIcon icon={faSyncAlt} />&nbsp;{t("takeaway.note")}
                </div>
                <div
                  className="s-btn s2 delete-btn e-m-right-5"
                  onClick={() => this.showAlert(i)}
                >
                  <FontAwesomeIcon icon={faTimesCircle} />&nbsp;{t("takeaway.cancel")}
                </div>
              </>
            )],
          },
        ],
      }
    };
    const rules = [
      {
        field: "customerName",
        method: "isEmpty",
        validWhen: false,
        message: t("takeaway.messageCustomerName"),
      },
      {
        field: "customerPhoneNumber",
        method: "isEmpty",
        validWhen: false,
        message: t("takeaway.messageCustomerPhoneNumber"),
      },

    ];
    this.validator = new Validator(rules);
    this.wrapperRef = React.createRef();
  }

  onCheckBoxAll = (e) => {
    const { dishList } = this.props;
    let { arr_isChecked } = this.state;
    for (let i = 0; i < dishList.length; i++) {
      this.props.onCheckedTakeaway(e, i);
      arr_isChecked[i] = e;
    }

    this.setState({ isCheckedAll: e, arr_isChecked })
  }


  onCheckbox = (e, i) => {
    let { arr_isChecked } = this.state;
    const { dishList } = this.props;
    let exists_false = false; // Ton tai false trong mang check
    arr_isChecked[i] = e;
    this.setState({
      arr_isChecked
    });
    if (e === false) {
      this.setState({ isCheckedAll: "" });
    } else {
      for (let i = 0; i < arr_isChecked.length; i++) {
        if (arr_isChecked[i] === false) {
          exists_false = true;
        }
      }
      if (arr_isChecked.length === dishList.length && exists_false === false) { // Kiem tra dieu kien de check all
        this.setState({
          isCheckedAll: true
        })
      }
    }
    this.props.onCheckedTakeaway(e, i);
    this.setState({
      isChecked: false,
    })
  }

  showOk_delete = () => {
    const { t } = this.props;
    Swal.fire({
      icon: 'success',
      text: "Hủy món thành công",
      title: t("takeaway.noti")
    })
  }

  showAlert = (i) => {
    const { t } = this.props;
    Swal.fire({
      title: t("takeaway.noti"),
      text: "Bạn có muốn hủy món này hay không ?",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: t("takeaway.yes"),
      cancelButtonText: t("takeaway.cancel"),
    }).then((result) => {
      if (result.value) {
        this.props.onDelete(i);
        this.showOk_delete();
      }
    })
  }

  showSaveOrderFail = (response) => {
    Swal.fire({
      icon: "error",
      title: "Thông báo",
      text: "Lưu order thất bại." + response,
    });
  }

  onSaveOrder = () => {
    const { t } = this.props;
    Swal.fire({
      title: t("takeaway.noti"),
      text: t("takeaway.swalSaveOrder"),
      icon: "info",
      showCancelButton: true,
      confirmButtonText: t("takeaway.yes"),
      cancelButtonText: t("takeaway.cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this.props.onOrder();
        this.props.changePage();
        this.props.close();
        this.setState({
          errors: {},
        });
      }/*  else {
          this.showErr();
          this.setState({
            errors: this.validator.validate(this.state),
          });
        }
    }*/
    });
  };



  render() {
    const {
      show,
      close,
      onAddNote,
      dishList,
      t
    } = this.props;


    const {
      showAddNote,
      dishSelected,
      newNote,
    } = this.state;

    return (
      <div>
        <Dialog show={show} close={close} innerClass="PopupSelectedList">
          <h3 className="sec-tit text-center">{t("takeaway.orderListed")}</h3>
          <div style={{ height: "100%" }}>
            <TableData
              option={this.state.TABLE_SETTING}
              dataSources={dishList}
              textNotiNoData={t("bookingTables.notiNodata")}
            >
            </TableData>
          </div>
          <aside className="acts text-right" style={{ display: "flex", justifyContent: "center" }}>
            <Button
              type="s3"
              className="e-m-right-10"
              onClick={this.props.close}
              disabled={dishList.length === 0}
            >
              {t("takeaway.back")}
            </Button>
            <Button
              disabled={dishList.length === 0}
              onClick={this.onSaveOrder}
            >
              Gửi Bếp/Bar
                </Button>
          </aside>

          <Dialog
            show={showAddNote}
            close={() => this.setState({ showAddNote: false })}
            innerClass="add-note"
          >
            <h3 className="sec-tit text-center">{dishSelected.name}</h3>
            <TextArea
              onChange={(e) => this.setState({ newNote: e.target.value })}
              placeholder="Thêm ghi chú"
              style={{
                height: 120,
                borderRadius: 8,
                borderColor: "#a1a1a1",
                padding: 5,
              }}
            ></TextArea>
            <aside className="acts text-right">
              <Button
                type="s3"
                className="grayscale e-m-right-10"
                onClick={() => this.setState({ showPopupConfirm: false })}
              >
                {t("takeaway.cancel")}
              </Button>
              <Button
                onClick={() => {
                  onAddNote(dishSelected.index, newNote);
                  this.setState({ showAddNote: false });
                }}
              >
                {t("takeaway.yes")}
              </Button>
            </aside>
          </Dialog>

        </Dialog>

      </div>
    );
  }
}
