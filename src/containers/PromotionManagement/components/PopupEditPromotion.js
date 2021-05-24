import React, { Component } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

import RadioButton from "../../../components/common/RadioList";
import TblFoodDiscount from "./ComponentAdd/TblFoodDiscount";
import TblOrderDiscount from "./ComponentAdd/TblOrderDiscount";
import TblVoucher from "./ComponentAdd/TblVoucher";
import TblDatePromotion from "./ComponentAdd/TblDatePromotion";
import { STATUS_PROMOTION } from "../../../consts/settings/promotion";
import Validator from "../../../utils/validator";
import * as apiPromotion from "../../../api/promotion";
import {
  PROMOTION_BILL_TYPE_ID,
  PROMOTION_ITEM_TYPE_ID,
} from "../../../consts/constants";

import Swal from "../../../utils/sweetalert2";


class PopupEditPromotion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0,
      selected: this.getType(this.props.PromotionInf.promotion_type_id),
      isStatus: this.props.PromotionInf.is_active ? 1 : 0,
      name: this.props.PromotionInf.name,
      startDate: new Date(this.props.PromotionInf.date_start),
      endDate: new Date(this.props.PromotionInf.date_end),
      startTime: this.props.PromotionInf.hour_start,
      endTime: this.props.PromotionInf.hour_end,
      days: [
        { monday: this.props.PromotionInf.monday },
        { tuesday: this.props.PromotionInf.tuesday },
        { wednesday: this.props.PromotionInf.wednesday },
        { thursday: this.props.PromotionInf.thursday },
        { friday: this.props.PromotionInf.friday },
        { saturday: this.props.PromotionInf.saturday },
        { sunday: this.props.PromotionInf.sunday },
      ],
      promotionDetails: [],
      description: this.props.PromotionInf.description,
      errors: {},
      isLoadingPromotionDetails: true,
    };
    const rules = [
      {
        field: "name",
        method: "isEmpty",
        validWhen: false,
        message: "Vui lòng nhập tên chương trình.",
      },
    ];
    this.validator = new Validator(rules);
  }

  getType = (promotion_type_id) => {
    switch (promotion_type_id) {
      case PROMOTION_BILL_TYPE_ID:
        return 1;
      case PROMOTION_ITEM_TYPE_ID:
        return 2;
      case "43fa2687-53d0-4dbc-aefd-32345913f65f":
        return 3;
      case "7054eadd-8962-472c-9ac3-e0b7ff40a835":
        return 4;
      default:
        break;
    }
  };

  componentDidMount = async () => {
    const { selected } = this.state;
    try {
      const data = {
        promotion_id: this.props.PromotionInf.id,
      };

      let promotionDetails = [];
      if (selected === 1) {
        const res = await apiPromotion.getPromotionBillDetailById({ data });
        promotionDetails = res.data.data.promotion_bill_details.map(
          (item, i) => {
            return {
              ...item,
              total: item.total_money,
              type: 0,
              isCheck: false,
            };
          }
        );
      } else if (selected === 2) {
        const res = await apiPromotion.getPromotionItemDetailById({ data });
        const itemList = res.data.data.promotion_item_details;
        itemList.forEach((item, i) => {
          const index = promotionDetails
            .map((e) => {
              return e.discount;
            })
            .indexOf(item.discount);
          if (index === -1) {
            promotionDetails.push({
              discount: item.discount,
              type: 0,
              isCheck: false,
              totals: [{ ...item }],
            });
          } else {
            promotionDetails[index] = {
              ...promotionDetails[index],
              totals: [...promotionDetails[index].totals, { ...item }],
            };
          }
        });
      }
      this.setState({ promotionDetails, isLoadingPromotionDetails: false });
    } catch (err) {
      console.log(err);
    }
  };

  radioChangedTypePromotion = () => {
    const { promotionDetails } = this.state;
    switch (this.state.selected) {
      case 1:
        return (
          <TblOrderDiscount
            dataTbl={promotionDetails}
            onChange={(promotionDetails) => this.setState({ promotionDetails })}
          />
        );
      case 2:
        return (
          <TblFoodDiscount
            dataTbl={promotionDetails}
            onChange={(promotionDetails) => this.setState({ promotionDetails })}
          />
        );
      case 3:
        return <TblVoucher dataTbl={[]} />;
      default:
        break;
    }
  };

  editPromotion = () => {
    const {
      name,
      selected,
      isStatus,
      startDate,
      endDate,
      startTime,
      endTime,
      promotionDetails,
      days,
      description,
    } = this.state;


    let promotion_type_id = "";
    let promotion_details = [];

    switch (selected) {
      case 1:
        promotion_type_id = PROMOTION_BILL_TYPE_ID;
        promotion_details = promotionDetails.map((item) => {
          return {
            discount: item.discount,
            id: item.id,
            total_money: item.total,
          };
        });
        break;
      case 2:
        promotion_type_id = PROMOTION_ITEM_TYPE_ID;
        let totals = [];
        promotionDetails.forEach((dishes, i) => {
        console.log("PopupEditPromotion -> editPromotion -> promotionDetails", promotionDetails)
          totals = totals.concat(
            dishes.totals.map((dish) => {
              return {
                id: dish.id,
                item_id: dish.item_id,
                discount: parseInt(promotionDetails[i].discount),
              };
            })
          );
        });
        promotion_details = totals.map((item) => {
          return {
            item_id: item.item_id,
            discount: item.discount,
            id: item.id,
          };
        });
        break;
      case 3:
        promotion_type_id = "43fa2687-53d0-4dbc-aefd-32345913f65f";
        break;
      case 4:
        promotion_type_id = "7054eadd-8962-472c-9ac3-e0b7ff40a835";
        break;
      default:
        break;
    }

    const data = {
      name: name,
      name_search: name,
      is_active: isStatus ? true : false,
      description: description,
      date_start: new Date(startDate).toString(),
      date_end: new Date(endDate).toString(),
      hour_start: startTime,
      hour_end: endTime,
      monday: days[0]["monday"],
      tuesday: days[1]["tuesday"],
      wednesday: days[2]["wednesday"],
      thursday: days[3]["thursday"],
      friday: days[4]["friday"],
      saturday: days[5]["saturday"],
      sunday: days[6]["sunday"],
      promotion_type_id,
      promotion_bill_details: promotion_details,
      promotion_item_details: promotion_details,
      id: this.props.PromotionInf.id,
      type: selected,
    };

    if (
      Object.entries(this.validator.validate(this.state)).length === 0 &&
      this.validator.validate(this.state).constructor === Object
    ) {
      if (startDate === null || endDate === null) {
        this.setState({
          errors: { err: "Ngày bắt đầu hoặc ngày kết thúc bị rỗng!" },
        });
      } else if (startDate > endDate) {
        this.setState({
          errors: { err: "Ngày bắt đầu lớn hơn ngày kết thúc!" },
        });
      } else if (promotionDetails.length === 0) {
        this.setState({
          errors: { err: "Chưa có chi tiết khuyến mãi!" },
        });
      } else {
        this.setState({
          errors: {},
        });
        Swal.fire({
          title: "Are you sure?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, edit it!",
          cancelButtonText: "No, cancel!",
        }).then((result) => {
          if (result.value) {
            this.props.actions.editPromotion({ data });
        this.props.hide();
          }
        });
        
      }
    } else {
      this.setState({
        errors: this.validator.validate(this.state),
      });
    }
  };
  render() {
    const { hide } = this.props;
    const {
      startDate,
      endDate,
      startTime,
      endTime,
      days,
      name,
      isStatus,
      description,
      isLoadingPromotionDetails,
    } = this.state;
    return (
      <div
        className="popup mfp-container mfp-s-ready mfp-inline-holder"
        style={{ zIndex: 10, position: "fixed" }}
      >
        <div className="mfp-content">
          <section
            id="popup-edit-promotion"
            className="popup-box popup-add-new"
            ref={this.wrapperRef}
            style={{ maxWidth: 1170 }}
          >
            <button
              title="Close (Esc)"
              type="button"
              className="mfp-close"
              onClick={this.props.hide}
            >
              {" "}
              ×{" "}
            </button>
            <h3 className="title">Sửa chương trình khuyến mãi</h3>
            <div className="block-item-1">
              <div className="block-item__left">
                <div className="group-item">
                  {this.state.errors.name ? (
                    <span
                      className="validation"
                      style={{ display: "block", fontSize: 14 }}
                    >
                      {this.state.errors.name}
                    </span>
                  ) : null}
                  <div className="form-group ">
                    <label className="control-label">
                      Tên chương trình (*)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue={name}
                      onChange={(name) =>
                        this.setState({
                          name: name.target.value,
                          errors: { name: "" },
                        })
                      }
                    />
                  </div>
                </div>

                <div className="radio-group flex-box align-center">
                  <label style={{ marginRight: 110 }}>Trạng thái</label>
                  <RadioButton
                    name="status"
                    dataSource={STATUS_PROMOTION}
                    onChange={(isStatus) => this.setState({ isStatus })}
                    selected={isStatus}
                  />
                </div>
                {this.state.errors.err ? (
                  <span
                    className="validation"
                    style={{ display: "block", fontSize: 14 }}
                  >
                    {this.state.errors.err}
                  </span>
                ) : null}
              </div>
              <div className="block-item__right">
                <textarea
                  placeholder="Ghi chú"
                  className="form-control"
                  defaultValue={description}
                  onChange={(e) =>
                    this.setState({ description: e.target.value })
                  }
                ></textarea>
              </div>
            </div>
            <div className="block-item-2">
              <Tabs
                selectedIndex={this.state.tabIndex}
                onSelect={(tabIndex) => this.setState({ tabIndex })}
              >
                <TabList className="tab-list">
                  <Tab>Chi tiết khuyến mãi</Tab>
                  <Tab>Thời gian áp dụng</Tab>
                </TabList>
                <TabPanel style={{ minHeight: 355 }}>
                  <div className="content">
                    {!isLoadingPromotionDetails &&
                      this.radioChangedTypePromotion()}
                  </div>
                </TabPanel>
                <TabPanel>
                  <TblDatePromotion
                    startDate={startDate}
                    setStartDate={(startDate) => this.setState({ startDate })}
                    endDate={endDate}
                    setEndDate={(endDate) => this.setState({ endDate })}
                    startTime={startTime}
                    setStartTime={(startTime) => this.setState({ startTime })}
                    endTime={endTime}
                    setEndTime={(endTime) => this.setState({ endTime })}
                    days={days}
                    setDays={(days) => this.setState({ days })}
                  />
                </TabPanel>
              </Tabs>
            </div>
            <div style={{ position: "absolute", bottom: 20, right: 38 }}>
              <div className="main-btn close-popup-btn" onClick={hide}>
                QUAY LẠI
              </div>
              <div
                className="main-btn s2"
                style={{ marginLeft: 15 }}
                onClick={this.editPromotion}
              >
                THÊM
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }
}
export default PopupEditPromotion;
