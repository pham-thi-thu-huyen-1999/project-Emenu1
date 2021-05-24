import React, { Component } from 'react';
import addNote from '../img/add-note.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Swal from "../../../utils/sweetalert2";
import {
  faClipboardList, faTrashAlt, faEdit,
  faTimesCircle
} from "@fortawesome/free-solid-svg-icons";
import edit from '../img/edit.png'
import bepbar from '../img/icon-bar.png'
import { NumberRange, Dialog, Button, TextArea, } from "../../../components/common";
import PopupQuantity from "./PopupQuantity";
const LON = "71926adaf-f1d0-4c0b-b8b2-87fca2d953cd";
const KG = "745e5b5d-f19a-40ac-8c17-e6e584a79483";
const CHAI = "1fd39cef-f6d0-4010-b672-ce8c98969ffb";
class SidebarRight extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPopupConfirm: false,
      showAddNote: false,
      dishSelected: {},
      newNote: "",
      isChecked: false,
      arr_isChecked: [this.props.dishList.map((item) => { return item.is_takeaway ? item.is_takeaway : false })],
      isCheckedAll: false,
      errors: {},
      showQuantity: false
    }
  }

  showOk_delete = () => {
    const { t } = this.props;
    Swal.fire({
      icon: 'success',
      text: t("orderFood.success"),
      title: t("takeaway.noti")
    })
  }

  showAlert = (i) => {
    const { t } = this.props;
    Swal.fire({
      title: t("takeaway.noti"),
      text: t("orderFood.confrim"),
      icon: "info",
      showCancelButton: true,
      confirmButtonText: t("takeaway.yes"),
      cancelButtonText: t("takeaway.cancel"),
    }).then((result) => {
      if (result.value) {
        this.props.onVisibleClick()
        this.props.onDelete(i);
        this.showOk_delete();
      }
    })
  }

  showSaveOrderFail = (response) => {
    const { t } = this.props;
    Swal.fire({
      icon: "error",
      title: t("orderFood.dialog"),
      text: t("takeaway.swalSaveOrderFail") + response,
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
        this.props.onVisibleClick();
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

  onVisiblePopupQuantity = () => {
    this.setState({ showQuantity: false })
  }

  addNumber = (index, value) => {
    if (value > 0) {
      this.props.onChangeQuantity(index, value, true)
    }
  }

  render() {
    const { t, totalFood, dishList,
      onAddNote, lng, partnerSetting
    } = this.props
    const {
      showAddNote,
      dishSelected,
      newNote,
    } = this.state;

    let unit_price = "";
    if(partnerSetting && partnerSetting.currency)
    {
      if (lng === "vi") {
        unit_price = partnerSetting.currency.name_vn;
      } else if (lng === "en") {
        unit_price = partnerSetting.currency.name_en;
      } else {
        unit_price = partnerSetting.currency.name_jp;
      }
    }else {
      unit_price = "VNĐ";
    }

    return (
      <div className="block-sidebar">
        <div className="header">
          <div className="title">{t("takeaway.orderListed")}</div>
          <div className="count-food">{t('orderFood.total')} <span style={{ width: 20, display: "inline-block", textAlign: 'center' }}>{totalFood}</span> {t('orderFood.food')}</div>
        </div>
        <div className="body">
          <div className="row-header">
            <p>{t('orderFood.name')}</p>
            <p>{t('orderFood.quantily')}</p>
            <p>{t('orderFood.price')}</p>
          </div>
          <div className="body-item">
            {
              dishList.length > 0 && dishList.map((item, index) => {
                return (<div className="row-items" key={index}>
                  <div className="items-content">
                    <div className="name">{item.name}</div>
                    {/* item.unit_name.replace(/ +/g, "") === "Lon" || item.unit_name.replace(/ +/g, "")  === "Chai" || item.unit_name.replace(/ +/g, "")  === "Ký(Kg)" */}
                    {item.qty_type === 1 ?
                      <div className="quantity-food">
                        <div className="e-m-top-5 e-m-right-5">{item.qty} {item.unit_name}</div>
                      </div> :
                      <div className="numRange"> <NumberRange min={1} max={99} defaultValue={item.qty}
                        onChange={(quantity) => { this.props.onChangeQuantity(index, quantity) }}
                      />
                      </div>
                    }
                    <div className="price">{item.price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}{unit_price}</div>
                  </div>
                  {item.qty_type === 1 && item.is_open_price === true ?
                    <div className="change-qty" onClick={() => this.setState({ showPopupPriceWithQty: true, dishSelected: { index: index, ...item } })}><FontAwesomeIcon icon={faEdit} /></div>
                    : (item.qty_type === 1 ? <div className="change-qty" onClick={() => this.setState({ showQuantity: true, dishSelected: { index: index, ...item } })}><FontAwesomeIcon icon={faEdit} /></div> : null)}  {/* <div className="change-qty" onClick={() => this.setState({ showQuantity: true, dishSelected: { index: index, ...item } })}><FontAwesomeIcon icon={faEdit} /></div> */}  {/* change-quantity */}
                  <div className="note-food">
                    {item.note !== undefined ?
                      <div className="notes e-m-top-5"> {item.note}</div> : null
                    }

                    {item.note === undefined || item.note === "" ? <div className="media"
                      onClick={(e) => this.setState({
                        showAddNote: true,
                        dishSelected: { index: index, ...item },
                      })}
                    > <img src={addNote} /> </div> :
                      <div className="media"
                        onClick={(e) => this.setState({
                          showAddNote: true,
                          dishSelected: { index: index, ...item },
                        })}
                      > <img src={addNote} /> </div>
                    }
                    {/* <div className="btn-edit-note"
                      onClick={(e) => this.setState({
                        showAddNote: true,
                        dishSelected: { index: index, ...item },
                      })}> <img src={edit} /> </div> */}
                  </div>
                  <div className="delete"
                    onClick={() => this.showAlert(index)}
                  > <FontAwesomeIcon icon={faTrashAlt} /></div>
                </div>)
              }
              )
            }
          </div>
        </div>
        <div className="footer">
          {/* <Button
            className="emenu-button s-btn e-border-gray"
            // disabled={dishList.length === 0}
            onClick={this.props.onShowOrder}
          > <span><FontAwesomeIcon icon={faClipboardList} /></span>{t('orderFood.titleOrderFood')}</Button> */}
          <Button
            className="emenu-button s-btn"
            type="s2"
            onClick={() => this.props.backOrderList()}
          >
            <FontAwesomeIcon icon={faTimesCircle} />{" "}
            {t("orderFood.cancel")}
          </Button>
          <Button
            className="emenu-button s-btn e-border-gray"
            disabled={dishList.length === 0}
            onClick={this.props.openPopupSelectedList} /* this.onSaveOrder */
          ><img src={bepbar} />Xác nhận</Button>
        </div>

        <Dialog
          show={showAddNote}
          close={() => this.setState({ showAddNote: false })}
          innerClass="add-note"
        >
          <h3 className="sec-tit text-center">{dishSelected.name}</h3>
          <TextArea
            onChange={(e) => this.setState({ newNote: e.target.value })}
            placeholder="Thêm ghi chú"
            defaultValue={dishSelected.note !== undefined ? dishSelected.note : ''}
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

        {this.state.showQuantity && <PopupQuantity isShow={this.state.showQuantity}
          t={t} item={dishSelected}
          onClose={() => this.onVisiblePopupQuantity()}
          number={dishSelected.qty}
          addNumber={value => this.addNumber(dishSelected.index, value)}
          edit={true}
        />}

      </div>
    );
  }
}

export default SidebarRight;