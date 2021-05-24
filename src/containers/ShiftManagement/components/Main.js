import React from "react";
import { Button, TableSlider, Dialog, TableData } from "../../../components/common/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loading from "../../../components/common/Loading"
import {
  faPencilAlt,
  faTimesCircle,
  faPlusCircle, faLongArrowAltLeft
} from "@fortawesome/free-solid-svg-icons";
import PopupAddShift from "./PopupShiftAdd";
import PopupEditShift from "./PopupShiftEdit";
import Swal from '../../../../src/utils/sweetalert2';

export default class Main extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showPopupAddShift: false,
      showPopupEditShift: false,
      shiftEdit: {}
    }
  }
  clickEditShift = (shiftEdit) => {
    this.setState({
      showPopupEditShift: true,
      shiftEdit
    })
  }
  showSuccess = () => {
    const { t } = this.props
    Swal.fire({
      icon: 'success',
      title: `${t("shiftTranslas:deleteSuccess")}!`,
      showConfirmButton: true,
    })
  }
  showErr = () => {
    const { t } = this.props
    Swal.fire({
      icon: 'error',
      title: `${t("shiftTranslas:deleteError")}!`,
      text: `${t("shiftTranslas:reqCheckAgain")}!`
    })
  }
  clickDeleteShift = shift => {
    const { t } = this.props
    Swal.fire({
      title: `${t("shiftTranslas:youSure")}?`,
      text: `${t("shiftTranslas:confirmDelete")}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `${t("shiftTranslas:yesDelete")}!`,
      cancelButtonText: `${t("shiftTranslas:cancel")}!`
    }).then((result) => {
      if (result.value) {
        this.props.actions.deleteShift({
          shift_id: shift.id,
          deltSuccess: this.showSuccess,
          deltError: this.showErr
        })
      }
    })
  }
  render() {
    const { showPopupAddShift, showPopupEditShift, shiftEdit } = this.state;
    const { ...rest } = this.props;
    let { t } = this.props;
    const TABLE_SETTING = {
      heads: [
        {
          text: `${t("shiftTranslas:headStt")}`,
          width: "10%"
        },
        {
          text: `${t("shiftTranslas:headNameShift")}`,
          width: "30%"
        },
        {
          text: `${t("shiftTranslas:headTimeStart")}`,
          width: "30%"
        },
        {
          text: `${t("shiftTranslas:headTimeEnd")}`,
          width: "30%"
        }
      ],
      columns: [
        {
          key: 'id',
          render: (item, index) => {
            return (
              <span>{index + 1}</span>
            )
          },
          width: "10%"
        },
        {
          key: 'name',
          width: "30%"
        },
        {
          key: 'start_time',
          width: "30%"
        },
        {
          key: 'end_time',
          width: "30%"
        },
        {
          key: '',
          actions: [
            (item) => (
              <Button
                className="s-btn edit-btn e-m-right-10"
                onClick={e => this.clickEditShift(item)}
              >
                <FontAwesomeIcon icon={faPencilAlt} className="e-m-right-5" />{t("promotions.edit")}
              </Button>),
            (item) => (
              <Button
                className="s-btn s2 delete-btn e-m-right-10"
                type="s2"
                onClick={e => this.clickDeleteShift(item)}
              >
                <FontAwesomeIcon icon={faTimesCircle} className="e-m-right-5" />{t("promotions.delete")}
              </Button>
            )
          ]
        }
      ]
    }
    console.log(this.props.history)
    return (
      <main className="nofooter" >
        <Loading show={this.props.isLoading} />
        <div className="shift-management">
          <div className="container-shift-manage flex">
            <div className="popup-box">
              <div className="title-btn e-flex content-center item-center">
                <div className="btn-back">
                  <Button className="s3"
                    onClick={() => { this.props.history.push("/menu") }}>
                    <FontAwesomeIcon icon={faLongArrowAltLeft} />
                    <span className="e-m-left-5">{t("textCommon.back")}</span>
                  </Button>
                </div>
                <h3 className="e-flex content-center">{t("shiftTranslas:title")}</h3>
                <div className="btn-add e-flex content-end">
                  <Button onClick={() => this.setState({ showPopupAddShift: true })}>
                    <FontAwesomeIcon icon={faPlusCircle} /><span>{t("shiftTranslas:add")}</span></Button>
                </div>
              </div>
              <div className="shift-list">
                <TableData
                  option={TABLE_SETTING}
                  dataSources={this.props.listShifts}
                >
                </TableData>
              </div>
            </div>
          </div>
          <Dialog
            show={showPopupAddShift}
            close={() => this.setState({ showPopupAddShift: false })}
            innerClass="popup-box-add-shift"
          >
            <PopupAddShift
              hide={() => this.setState({ showPopupAddShift: false })}
              {...rest}
            />
          </Dialog>
          <Dialog
            show={showPopupEditShift}
            close={() => this.setState({ showPopupEditShift: false })}
            innerClass="popup-box-add-shift"
          >
            <PopupEditShift
              shiftEdit={shiftEdit}
              hide={() => this.setState({ showPopupEditShift: false })}
              {...rest}
            />
          </Dialog>
        </div>
      </main >
    )
  }
}