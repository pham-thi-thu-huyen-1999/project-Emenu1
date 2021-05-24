import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import TableData from '../../../components/common/TableData';
import {
  faSyncAlt
} from "@fortawesome/free-solid-svg-icons";
import "./Category.scss";
import Validator from "../../../utils/validator";
import NumberRange from "./../../../components/common/NumberRange";
import { Dialog, Button, TextArea, Input, CheckBox } from "../../../components/common";
import PopupSelectedList_confirm from "./PopupSelectedList_confirm";
import Swal from "../../../utils/sweetalert2";
import { get } from "../../../services/localStorage";
import formats from "../../../utils/formats";

export default class PopupSelectedList extends Component {
  constructor(props) {
    super(props);
    const { t } = this.props;
    this.state = {
      indexSlide: 0,
      showPopupConfirm: false,
      /* showPopupSelectedList_confirm_food: false, */
      showAddNote: false,
      surcharge: 0,
      dishSelected: {},
      newNote: "",
      customerName: "",
      customerPhoneNumber: "",
      isChecked: false,
      errors: {},
      is_table: get("is_table"),
      TABLE_SETTING: {
        heads: [
          {
            text: t("takeaway.number"),
            width: "5%"
          },
          {
            text: t("takeaway.takeaway"),
            width: "12%"
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
                <CheckBox onChange={(e) => this.onCheckbox(e, i)} key={i} checked={this.state.isChecked}>  </CheckBox>
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

              /* <NumberRange min={1} max={20} defaultValue={item.qty}
                onChange={(quantity) => { this.props.onChangeQuantity(i, quantity) }}
              /> */
              <span>{item.qty}</span>
            )
          },
          {
            key: "price",
            width: "12%",
            render: (item, i) => (
              <>
                {formats.moneyFormat(item.price)}{this.props.unit_price}
              </>)
          },
          {
            key: "total",
            width: "15%",
            render: (item, i) => (
              <>
                {formats.moneyFormat(item.qty * item.price)}{this.props.unit_price}
              </>)
          },
          /* {
            key: "acts",
            width: "",
            actions: [(item, i) => (
              <>
                <Button
                  className="s-btn e-m-right-5"
                  onClick={(e) => this.setState({
                    showAddNote: true,
                    dishSelected: { index: i, ...item },
                  })}
                >
                  <FontAwesomeIcon className="e-m-right-5" icon={faSyncAlt} />{t("takeaway.note")}
                </Button>
                <Button
                  className="s-btn s2 delete-btn"
                  onClick={() => this.showAlert(i)}
                >
                  <FontAwesomeIcon className="e-m-right-5" icon={faTimesCircle} />{t("takeaway.cancel")}
                </Button>
              </>
            )],
          }, */
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

  componentWillUnmount() {
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state, callback) => {
      return;
    };
  }

  componentDidMount = () => {
    const { t } = this.props;
    if (this.state.is_table === false) {
      this.setState({
        TABLE_SETTING: {
          heads: [
            {
              text: t("takeaway.number"),
              width: "7%"
            },
            {
              text: t("takeaway.nameFood"),
              width: "27%"
            },
            {
              text: t("takeaway.note"),
              width: "22%"
            },
            {
              text: t("takeaway.quantity"),
              width: "17%"
            },
            {
              text: t("takeaway.price"),
              width: "12%"
            },
            {
              text: t("takeaway.priced"),
              width: "17%"
            },
          ],
          columns: [
            {
              key: "id",
              width: "7%",
              render: (item, index) => {
                return index + 1;
              },
            },
            {
              key: "name",
              width: "27%",
            },
            {
              key: "note",
              width: "22%",
            },
            {
              key: "qty",
              width: "17%",
              render: (item, i) => (

                /*<NumberRange min={1} max={20} defaultValue={item.qty}
                  onChange={(quantity) => { this.props.onChangeQuantity(i, quantity) }}
                /> */
                <span>{item.qty}</span>
              )
            },
            {
              key: "price",
              width: "12%",
              render: (item, i) => (
                <>
                  {formats.moneyFormat(item.price)}{this.props.unit_price}
                </>)
            },
            {
              key: "total",
              width: "17%",
              render: (item, i) => (
                <>
                  {formats.moneyFormat(item.qty * item.price)}{this.props.unit_price}
                </>)
            },
            /* {
              key: "acts",
              width: "",
              actions: [(item, i) => (
                <>
                  <Button
                    className="s-btn e-m-right-5"
                    onClick={(e) => this.setState({
                      showAddNote: true,
                      dishSelected: { index: i, ...item },
                    })}
                  >
                    <FontAwesomeIcon className="e-m-right-5" icon={faSyncAlt} />{t("takeaway.note")}
                  </Button>
                  <Button
                    className="s-btn s2 delete-btn"
                    onClick={() => this.showAlert(i)}
                  >
                    <FontAwesomeIcon className="e-m-right-5" icon={faTimesCircle} />{t("takeaway.cancel")}
                  </Button>
                </>
              )],
            }, */
          ],
        }
      })
    }
  }

  showOk = () => {
    const { t } = this.props;
    Swal.fire({
      icon: 'success',
      text: t("takeaway.swalSaveOrderSuccess"),
      title: t("takeaway.noti")
    })
  }

  showErr = () => {
    const { t } = this.props;
    Swal.fire({
      icon: 'error',
      title: t("takeaway.noti"),
      text: t("takeaway.swalSaveOrderFail")
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

  showErr_delete = () => {
    const { t } = this.props;
    Swal.fire({
      icon: 'error',
      title: t("takeaway.noti"),
      text: "Hủy món thất bại"
    })
  }

  showAlert = (i) => {
    const { t } = this.props;
    const { customerName, customerPhoneNumber, isChecked } = this.state;
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
      } else {
        this.showErr_delete();
      }
    })
  }

  onSaveOrder = () => {
    const { t } = this.props;
    const { customerName, customerPhoneNumber, isChecked } = this.state;
    Swal.fire({
      title: t("takeaway.noti"),
      text: t("takeaway.swalSaveOrder"),
      icon: "info",
      showCancelButton: true,
      confirmButtonText: t("takeaway.yes"),
      cancelButtonText: t("takeaway.cancel"),
    }).then((result) => {
      if (result.value) {
        if (Object.entries(this.validator.validate(this.state)).length === 0 &&
          this.validator.validate(this.state).constructor === Object) {
          this.props.onOrder(customerName, customerPhoneNumber, isChecked);
          this.props.changePage();
          this.props.close();
          this.setState({
            errors: {},
          });
        } else {
          this.showErr();
          this.setState({
            errors: this.validator.validate(this.state),
          });
        }
      }
    });
  };

  onConfirm = async() => {
    const { customerName, customerPhoneNumber } = this.state;
    if (Object.entries(this.validator.validate(this.state)).length === 0 &&
      this.validator.validate(this.state).constructor === Object) {
      let checked = "";

      await this.props.onOrder(customerName, customerPhoneNumber, checked);

      await this.props.changePage();

      /* await this.setState({
        showPopupSelectedList_confirm_food: true,
        errors: {},
      }); */

      //await this.props.close();

    }
    else {
      this.setState({
        errors: this.validator.validate(this.state),
      });
    }
  };

  onCheckbox = (e, i) => {
    this.props.onCheckedTakeaway(e, i);
    this.setState({
      isChecked: false,
    })
  }


  render() {
    const {
      show,
      close,
      onMinus,
      onPlus,
      onDelete,
      onAddNote,
      dishList,
      showPopupPayments,
      onOrder,
      /* onClose, */
      orderId,
      showPopupSelectedList_confirm_food,
      t
    } = this.props;


    const {
      /* indexSlide, */
      /* dishList, */
      showAddNote,
      dishSelected,
      newNote,
      /* surcharge,
      showPopupPaymentMethods, */
      customerName,
      customerPhoneNumber,
      isChecked,
      errors,
    } = this.state;

    var totalPrice = 0;
    for (let i = 0; i < dishList.length; i++) {
      totalPrice += dishList[i].qty * dishList[i].price;
    }

    return (
      <div>
        <Dialog show={show} close={close} innerClass="PopupSelectedList">
          <h3 className="sec-tit text-center">{t("takeaway.orderListed")}</h3>
          <div style={{ height: "calc(100% - 340px)" }}>
            <TableData
              option={this.state.TABLE_SETTING}
              dataSources={this.props.dishList}
              className="dish-takeaway-list"
              textNotiNoData={t("bookingTables.notiNodata")}
            >
            </TableData>
          </div>
          <aside className="flex-view e-m-top-20">
            <div className="customer-info" style={{ width: "447px", height: "220px" }}>
              <h4 className=" text-center">{t("takeaway.infoCustomer")}</h4>
              <Input
                defaultValue={this.state.customerName}
                type="text"
                placeholder="Nhập tên..."
                className="e-m-bottom-5"
                style={{ backgroundColor: "white" }}
                onChange={(e) => this.setState({ customerName: e.target.value })}
              />
              {errors.customerName ? (
                <div className="validation">{errors.customerName}</div>
              ) : null}
              <Input
                defaultValue={this.state.customerPhoneNumber}
                type="number"
                placeholder="Nhập số điện thoại..."
                style={{ backgroundColor: "white", marginTop: "15px" }}
                onChange={(e) => this.setState({ customerPhoneNumber: e.target.value })}
              />
              {errors.customerPhoneNumber ? (
                <div className="validation">{errors.customerPhoneNumber}</div>
              ) : null}
            </div>
            <div>
              <div
                className="flex-view e-m-bottom-10"
                style={{ fontSize: 20, textAlign: "right" }}
              >
                <div>
                  <div>{t("takeaway.total")}</div>
                </div>
                <div className="e-m-left-10" style={{ color: "#f27922" }}>
                  <div>
                    {formats.moneyFormat(Math.ceil(totalPrice))}
                  {" "}{this.props.unit_price}
                </div>

                </div>
              </div>
            </div>
          </aside>
          <aside className="acts text-right">
            <Button
              className="e-m-right-10"
              onClick={close}
              type="s3"
            >
              {t("takeaway.cancel")}
            </Button>
            <Button
              className="e-m-right-10"
              onClick={this.onConfirm}
              disabled={dishList.length === 0}
            >
              {t("takeaway.proceedPayment")}
            </Button>
            <Button
              disabled={dishList.length === 0}
              onClick={this.onSaveOrder}
            >
              {t("takeaway.save")}
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

        {showPopupSelectedList_confirm_food ? <PopupSelectedList_confirm
          t={t}
          dishList={dishList}
          order_id={orderId}
          totalPrice={totalPrice}
          close={() => { this.props.onShowPopupSelectedList_confirm_food(); close(); }}
          show={showPopupSelectedList_confirm_food}
          showPopupPayments={showPopupPayments}
          customerPhoneNumber={customerPhoneNumber}
          customerName={customerName}
          onOrder={onOrder}
          orderItemById_children={this.props.orderItemById}
          billInfo={this.props.billInfo}
          unit_price={this.props.unit_price}
        /> : null}

      </div>
    );
  }
}
