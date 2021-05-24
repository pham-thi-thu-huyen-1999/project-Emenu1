import React, { Component } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

import RadioButton from "../../../components/common/RadioList";
import TblFoodDiscount from "./ComponentAdd/TblFoodDiscount";
import TblOrderDiscount from "./ComponentAdd/TblOrderDiscount";
import TblVoucher from "./ComponentAdd/TblVoucher";
import TblDatePromotion from "./ComponentAdd/TblDatePromotion";
import {
  STATUS_PROMOTION,
  TYPE_PROMOTION,
} from "../../../consts/settings/promotion";
import Validator from "../../../utils/validator";
import {
  PROMOTION_BILL_TYPE_ID,
  PROMOTION_ITEM_TYPE_ID,
} from "../../../consts/constants";
import Swal from "../../../utils/sweetalert2";

class PopupAddPromotion extends Component {
  constructor() {
    super();
    this.state = {
      tabIndex: 0,
      selected: 1,
      isStatus: 0,
      name: "",
      startDate: null,
      endDate: null,
      startTime: `${new Date().getHours()}:${
        (new Date().getMinutes() < 10 ? "0" : "") + new Date().getMinutes()
      }`,
      endTime: `${new Date().getHours()}:${
        (new Date().getMinutes() < 10 ? "0" : "") + new Date().getMinutes()
      }`,
      days: [
        { monday: true },
        { tuesday: true },
        { wednesday: true },
        { thursday: true },
        { friday: true },
        { saturday: true },
        { sunday: true },
      ],
      promotionDetails: [],
      description: "",
      errors: {},
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

  radioChangedTypePromotion = () => {
    switch (this.state.selected) {
      case 1:
        return (
          <TblOrderDiscount
            dataTbl={this.state.promotionDetails}
            onChange={(promotionDetails) => this.setState({ promotionDetails })}
          />
        );
      case 2:
        return (
          <TblFoodDiscount
            dataTbl={this.state.promotionDetails}
            onChange={(promotionDetails) => this.setState({ promotionDetails })}
          />
        );
      case 3:
        return <TblVoucher dataTbl={[]} />;
      default:
        break;
    }
  };

  addPromotion = () => {
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
            total_money: item.total,
            discount: item.discount,
          };
        });
        break;
      case 2:
        promotion_type_id = PROMOTION_ITEM_TYPE_ID;
        let totals = [];
        promotionDetails.forEach((dishes, i) => {
          totals = totals.concat(
            dishes.totals.map((dish) => {
              return {
                item_id: dish.item_id,
                discount: parseInt(promotionDetails[i].discount),
              };
            })
          );
        });
        promotion_details = totals.map((item) => {
          return { item_id: item.item_id, discount: item.discount };
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
      description,
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
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, create it!",
          cancelButtonText: "No, cancel!",
        }).then((result) => {
          if (result.value) {
            this.props.actions.createPromotion({ data });
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
    const { startDate, endDate, startTime, endTime, days } = this.state;
    return (
      <div
        className="popup mfp-container mfp-s-ready mfp-inline-holder"
        style={{ zIndex: 10, position: "fixed" }}
      >
        <div className="mfp-content">
          <section
            id="popup-add-tbl"
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
            <h3 className="title">THÊM chương trình khuyến mãi</h3>
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
                    selected={this.state.isStatus}
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
                  <Tab>Hình thức khuyến mãi</Tab>
                  <Tab>Thời gian áp dụng</Tab>
                </TabList>
                <TabPanel>
                  <div className="content">
                    <div className="radio-group flex-box align-center">
                      <RadioButton
                        name="type-promotion"
                        dataSource={TYPE_PROMOTION}
                        onChange={(selected) =>
                          this.setState({ selected, promotionDetails: [] })
                        }
                        selected={this.state.selected}
                      />
                    </div>
                    {this.radioChangedTypePromotion()}
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
                onClick={this.addPromotion}
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
export default PopupAddPromotion;
