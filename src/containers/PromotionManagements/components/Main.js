import React from "react";
import { Input, Button, SelectBox, Dialog, TableData } from "../../../components/common"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencilAlt,
  faTimesCircle,
  faPlusSquare,
  faSearch,
  faCaretDown,
  faLongArrowAltLeft
} from "@fortawesome/free-solid-svg-icons";
import AddPromotion from "./PopupAddPromotion";
import EditPromotion from "./PopupEditPromotion";
import moment from "moment";
import Loading from "../../../components/common/Loading";
import Swal from "../../../utils/sweetalert2";
import { LIMIT_PROMOTION } from "../../../consts/settings/promotion";

class Main extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      listPromotion: this.props.listPromotion,
      showPopupAddPromotion: false,
      showPopupEditPromotion: false,
      selected: null,
      promotionDetail: {},
      searchStatus: null,
      searchName: "",
      page: this.props.page,
      current: 1
    }
  }
  showErr = (err) => {
    const { t } = this.props
    Swal.fire({
      icon: 'error',
      title: `${t("promotions.error")}!`,
      text: `${t("promotions.reqCheckAgain")}!`
    })
  }
  /**
   * click edit promotion
   * @param {*} item
   */
  editPromotion = (item) => {
    if (item.promotion_type_id === 1) {
      this.props.actions.getPromotionBillDiscountById({
        promotion_id: item.id, callBack: () => {
          this.setState({
            showPopupEditPromotion: true,
            selected: item.promotion_type_id,
            promotionDetail: item
          })
        }
      })
    } else if (item.promotion_type_id === 2) {
      this.props.actions.getPromotionItemDiscountById({
        promotion_id: item.id, callBack: () => {
          this.setState({
            showPopupEditPromotion: true,
            selected: item.promotion_type_id,
            promotionDetail: item
          })
        }
      })
    } else if (item.promotion_type_id === 3) {
      this.props.actions.getPromotionComboItemDiscountById({
        promotion_id: item.id,
        callBack: () => {
          this.setState({
            showPopupEditPromotion: true,
            selected: item.promotion_type_id,
            promotionDetail: item
          })
        }
      })
    } else if (item.promotion_type_id === 4) {
      this.props.actions.getPromotionVoucherDiscountById({
        promotion_id: item.id,
        callBack: () => {
          this.setState({
            showPopupEditPromotion: true,
            selected: item.promotion_type_id,
            promotionDetail: item
          })
        }
      })
    }
  }
  popupDeleteSuccess = () => {
    const { t } = this.props
    Swal.fire({
      icon: 'success',
      title: `${t("promotions.deleteSucces")}`,
      text: `${t("promotions.deleted")}!`,
      showConfirmButton: true,
    })
  }
  /**
   * delete promotion by id
   * @param {*} promotion
   */
  deletePromotion = (promotion) => {
    const { t } = this.props
    Swal.fire({
      title: `${t("promotions.textNoti")}`,
      text: `${t("promotions.confirmDelete")}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `${t("promotions.yesAgree")}`
    }).then((result) => {
      if (result.value) {
        this.props.actions.deletePromotion({
          data: { promotion_id: promotion.id },
          deleteSuccess: this.popupDeleteSuccess
        })
      }
    })
  }
  closePopupEdit = () => {
    this.props.actions.resetPromotionBillDiscountById()
    this.setState({
      showPopupEditPromotion: false
    })
  }
  onSearch = () => {
    const { searchStatus, searchName } = this.state
    const params = {}
    if (searchName) {
      params.name_search = searchName
    } if (searchStatus) {
      params.is_active = searchStatus
    } if (!searchStatus) {
      params.is_active = searchStatus
    }
    this.props.actions.getListPromotionBySearch({ params })
    return params
  }
  loadMore = (data) => {
    const { page } = this.state;
    const { limitPage } = this.props
    if (page <= limitPage) {
      this.props.actions.getListPromotion({ page: page, limit: LIMIT_PROMOTION })
    }
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (JSON.stringify(nextProps.listPromotion) !== JSON.stringify(prevState.listPromotion)
      || nextProps.page !== prevState.page
    ) {
      return {
        listPromotion: nextProps.listPromotion,
        page: nextProps.page
      }
    }
    return null;
  }

  render() {
    const { ...rest } = this.props;
    const { t, isLoading, lng } = this.props
    const { showPopupAddPromotion, showPopupEditPromotion, selected,
      promotionDetail, listPromotion } = this.state;
    const TABLE_SETTING = {
      heads: [
        {
          text: `${t("promotions.stt")}`,
          width: "5%"
        },
        {
          text: `${t("promotions.showName")}`,
          width: "20%"
        },
        {
          text: `${t("promotions.fromDate")}`,
          width: "10%"
        },
        {
          text: `${t("promotions.toDate")}`,
          width: "10%"
        },
        {
          text: `${t("promotions.form")}`,
          width: "15%"
        },
        {
          text: `${t("promotions.status")}`,
          width: "15%"
        }
      ],
      columns: [
        {
          key: "id",
          render: (item, index) => {
            return index + 1;
          },
          width: "5%"
        },
        {
          key: "name",
          width: "20%"
        },
        {
          key: 'date_start',
          render: (item) => {
            return moment(item.date_start).format("DD/MM/YYYY")
          },
          width: "10%"
        },
        {
          key: "date_end",
          render: (item) => {
            return moment(item.date_end).format("DD/MM/YYYY")
          },
          width: "10%"
        },
        {
          key: "promotion_type",
          width: "15%",
          render: (item) => {
            return (
              <>{lng === "vi" ? item.promotion_type.name_vn
                : lng === "en" ? item.promotion_type.name_en
                  : item.promotion_type.name_jp}
              </>
            )
          }
        },
        {
          key: "is_active",
          render: (item) => {
            return (item.is_active && item.is_approved
              ? `${t("promotions.activated")}`
              : !item.is_active && item.is_approved
                ? `${t("promotions.applicableYet")}`
                : item.is_active && !item.is_approved ? "Chờ xét duyệt" : "Chờ xét duyệt")
          },
          width: "15%",
          actions: [
            (item) => (
              <Button
                className="btn-table-small e-m-right-5"
                type="s1"
                onClick={e => this.editPromotion(item)}
              >
                <FontAwesomeIcon icon={faPencilAlt} className="e-m-right-5" />{t("promotions.edit")}
              </Button>),
            (item) => (
              <Button
                className="btn-table-small e-m-right-5"
                type="s2"
                onClick={e => this.deletePromotion(item)}
              >
                <FontAwesomeIcon icon={faTimesCircle} className="e-m-right-5" />{t("promotions.delete")}
              </Button>
            )
          ]
        }
      ]
    }
    return (
      <div className="promotion-managaments">
        <Loading show={isLoading} />
        <div className="promotion-manage flex">
          <div className="popup-box">
            <div className="btnback-title e-flex content-center item-center">
              <div className="btn-back">
                <Button className="s3"
                  onClick={() => { this.props.history.push("/menu") }}>
                  <FontAwesomeIcon icon={faLongArrowAltLeft} />
                  <span className="e-m-left-5">{t("textCommon.back")}</span>
                </Button>
              </div>
              <h1 className="title-promotion">{t("promotions.title")}</h1>
            </div>
            <div className="search-add e-flex flex">
              <div className="list-field-search e-flex flex">
                <div className="field-search">
                  <Input
                    placeholder={t("promotions.searchByName")}
                    onChange={(e) => this.setState({ searchName: e.target.value })}
                  />
                </div>
                <div className="field-search">
                  <SelectBox
                    dataSource={[
                      { key: true, text: `${t("promotions.activated")}` },
                      { key: false, text: `${t("promotions.applicableYet")}` }
                    ]}
                    onChange={
                      searchStatus => this.setState({ searchStatus })
                    }
                    blank={t("promotions.searchByStatus")}
                  >
                    <div className="icon-dow">
                      <FontAwesomeIcon icon={faCaretDown} />
                    </div>
                  </SelectBox>
                </div>
                <div className="field-search e-flex content-start">
                  <Button onClick={this.onSearch}>
                    {t("promotions.search")}
                    <FontAwesomeIcon icon={faSearch} className="e-m-left-5" />
                  </Button>
                </div>
              </div>
              <div className="btn-add e-flex item-center">
                <Button type="s1" onClick={() => this.setState({ showPopupAddPromotion: true })}>
                  <FontAwesomeIcon icon={faPlusSquare} className="e-m-right-5" />
                  {t("promotions.add")}
                </Button>
              </div>
            </div>
            <div className="list-promotion">
              <TableData
                dataSources={listPromotion}
                option={TABLE_SETTING}
                onMore={this.loadMore}
                textNotiNoData={t("promotions.textNotiNoData")}
              >
              </TableData>
            </div>
          </div>
        </div>
        <Dialog
          title={t("promotions.titleAddPromotion")}
          show={showPopupAddPromotion}
          close={() => this.setState({ showPopupAddPromotion: false })}
          innerClass="popup-add-promotion"
        >
          <AddPromotion
            hide={() => this.setState({ showPopupAddPromotion: false })}
            {...rest}
          />
        </Dialog>
        <Dialog
          title={t("promotions.titleEditPromotion")}
          show={showPopupEditPromotion}
          close={this.closePopupEdit}
          innerClass="popup-add-promotion"
        >
          <EditPromotion
            promotionDetail={promotionDetail}
            selected={selected}
            hide={() => this.setState({ showPopupEditPromotion: false })}
            {...rest}
          />
        </Dialog>
      </div>
    )
  }
}
export default Main;